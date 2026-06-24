import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import { calculateFee } from "./fees";
import { AuctionEndedError, BadRequestError, InsufficientBalanceError } from "@/lib/errors";
import { AUCTION_EXTENSION_MINUTES, MIN_BID_INCREMENT_PERCENT } from "@/lib/constants";

/**
 * Auction settlement logic.
 * Handles bid placement, auction completion, and winner determination.
 */
export class AuctionManager {
  /**
   * Place a bid on an active auction.
   */
  async placeBid(params: {
    auctionId: string;
    userId: string;
    amount: Decimal;
    quantity: Decimal;
  }): Promise<{ bidId: string; isWinning: boolean }> {
    const { auctionId, userId, amount, quantity } = params;

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
    });

    if (!auction) {
      throw new BadRequestError("Auction not found");
    }

    if (auction.status !== "ACTIVE") {
      throw new AuctionEndedError("Auction is not active");
    }

    if (auction.endsAt < new Date()) {
      throw new AuctionEndedError("Auction has ended");
    }

    // Cannot bid on own auction
    if (auction.sellerId === userId) {
      throw new BadRequestError("Cannot bid on your own auction");
    }

    // Check minimum bid increment
    const currentPrice = auction.currentPrice;
    const minIncrement = currentPrice.times(MIN_BID_INCREMENT_PERCENT / 100);
    const minBid = currentPrice.plus(minIncrement);

    if (amount.lt(minBid)) {
      throw new BadRequestError(
        `Minimum bid is ${minBid.toString()} (current price + ${MIN_BID_INCREMENT_PERCENT}%)`
      );
    }

    // Verify the bidder has sufficient balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new BadRequestError("Wallet not found");
    }

    const totalCost = amount.times(quantity);
    const availableBalance = wallet.balanceUsd.minus(wallet.frozenUsd);
    if (availableBalance.lt(totalCost)) {
      throw new InsufficientBalanceError(
        "Insufficient balance to place this bid"
      );
    }

    // Freeze the bid amount
    await prisma.wallet.update({
      where: { userId },
      data: {
        frozenUsd: wallet.frozenUsd.plus(totalCost),
      },
    });

    // Unfreeze previous winning bid if this user was the previous winner
    const previousWinningBid = auction.bids.find((b) => b.isWinning);
    if (previousWinningBid) {
      await prisma.auctionBid.update({
        where: { id: previousWinningBid.id },
        data: { isWinning: false },
      });

      // Unfreeze the previous winner's funds
      const prevWallet = await prisma.wallet.findUnique({
        where: { userId: previousWinningBid.userId },
      });
      if (prevWallet) {
        const prevFrozen = previousWinningBid.amount.times(previousWinningBid.quantity);
        await prisma.wallet.update({
          where: { userId: previousWinningBid.userId },
          data: {
            frozenUsd: Decimal.max(prevWallet.frozenUsd.minus(prevFrozen), 0),
          },
        });
      }
    }

    // Create the new bid
    const bid = await prisma.auctionBid.create({
      data: {
        auctionId,
        userId,
        amount,
        quantity,
        isWinning: true,
      },
    });

    // Update auction
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        currentPrice: amount,
        bidCount: { increment: 1 },
        // Extend auction if ending soon
        ...(auction.endsAt.getTime() - Date.now() < AUCTION_EXTENSION_MINUTES * 60 * 1000
          ? {
              endsAt: new Date(
                auction.endsAt.getTime() + AUCTION_EXTENSION_MINUTES * 60 * 1000
              ),
            }
          : {}),
      },
    });

    return { bidId: bid.id, isWinning: true };
  }

  /**
   * Settle an auction after it has ended.
   * Creates the trade and transfers funds/credits.
   */
  async settleAuction(auctionId: string): Promise<{
    winnerId: string | null;
    finalPrice: Decimal | null;
  }> {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: {
          where: { isWinning: true },
          take: 1,
        },
      },
    });

    if (!auction) {
      throw new BadRequestError("Auction not found");
    }

    if (auction.status === "COMPLETED" || auction.status === "CANCELLED") {
      return { winnerId: null, finalPrice: null };
    }

    const winningBid = auction.bids[0] ?? null;

    // Check reserve price
    if (
      winningBid &&
      auction.reservePrice &&
      winningBid.amount.lt(auction.reservePrice)
    ) {
      // Reserve not met - cancel auction
      await this.cancelAuction(auctionId);
      return { winnerId: null, finalPrice: null };
    }

    if (!winningBid) {
      // No bids - mark as expired
      await prisma.auction.update({
        where: { id: auctionId },
        data: { status: "EXPIRED" },
      });
      return { winnerId: null, finalPrice: null };
    }

    // Calculate fee
    const tradeValue = winningBid.amount.times(winningBid.quantity);
    const fee = calculateFee(tradeValue.toNumber(), "auction");

    // Complete the auction
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: "COMPLETED",
        winningBidId: winningBid.id,
        feeUsd: new Decimal(fee.toFixed(4)),
      },
    });

    // Unfreeze the winner's funds and deduct the payment
    const winnerWallet = await prisma.wallet.findUnique({
      where: { userId: winningBid.userId },
    });
    if (winnerWallet) {
      const frozenAmount = winningBid.amount.times(winningBid.quantity);
      await prisma.wallet.update({
        where: { userId: winningBid.userId },
        data: {
          frozenUsd: Decimal.max(winnerWallet.frozenUsd.minus(frozenAmount), 0),
          balanceUsd: winnerWallet.balanceUsd.minus(frozenAmount),
        },
      });
    }

    // Credit the seller
    const sellerWallet = await prisma.wallet.findUnique({
      where: { userId: auction.sellerId },
    });
    if (sellerWallet) {
      const netProceeds = tradeValue.minus(new Decimal(fee.toFixed(4)));
      await prisma.wallet.update({
        where: { userId: auction.sellerId },
        data: {
          balanceUsd: sellerWallet.balanceUsd.plus(netProceeds),
          totalTraded: sellerWallet.totalTraded.plus(tradeValue),
        },
      });
    }

    // Create trade record
    await prisma.trade.create({
      data: {
        buyerId: winningBid.userId,
        sellerId: auction.sellerId,
        productId: auction.productId,
        quantity: winningBid.quantity,
        pricePerUnit: winningBid.amount,
        totalValue: tradeValue,
        buyerFee: new Decimal(0),
        sellerFee: new Decimal(fee.toFixed(4)),
        source: "auction",
        referenceId: auctionId,
      },
    });

    return {
      winnerId: winningBid.userId,
      finalPrice: winningBid.amount,
    };
  }

  /**
   * Cancel an auction and refund all frozen bids.
   */
  async cancelAuction(auctionId: string): Promise<void> {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: {
        bids: { where: { isWinning: true } },
      },
    });

    if (!auction) return;

    // Refund the winning bid
    const winningBid = auction.bids[0];
    if (winningBid) {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: winningBid.userId },
      });
      if (wallet) {
        const frozenAmount = winningBid.amount.times(winningBid.quantity);
        await prisma.wallet.update({
          where: { userId: winningBid.userId },
          data: {
            frozenUsd: Decimal.max(wallet.frozenUsd.minus(frozenAmount), 0),
          },
        });
      }
    }

    await prisma.auction.update({
      where: { id: auctionId },
      data: { status: "CANCELLED" },
    });
  }
}

export const auctionManager = new AuctionManager();
