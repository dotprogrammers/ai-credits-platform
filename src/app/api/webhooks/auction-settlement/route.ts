import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return error('UNAUTHORIZED', 'Invalid cron secret');
    }

    const now = new Date();

    const expiredAuctions = await prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        endsAt: { lte: now },
      },
      include: {
        bids: {
          where: { isWinning: true },
          take: 1,
        },
      },
    });

    const pendingAuctions = await prisma.auction.findMany({
      where: {
        status: 'PENDING',
        startsAt: { lte: now },
      },
    });

    let settled = 0;
    let activated = 0;

    for (const auction of pendingAuctions) {
      await prisma.auction.update({
        where: { id: auction.id },
        data: { status: 'ACTIVE' },
      });
      activated++;
    }

    for (const auction of expiredAuctions) {
      const winningBid = auction.bids[0];

      if (winningBid && (!auction.reservePrice || Number(winningBid.amount) >= Number(auction.reservePrice))) {
        const sellerWallet = await prisma.wallet.findUnique({ where: { userId: auction.sellerId } });
        const buyerWallet = await prisma.wallet.findUnique({ where: { userId: winningBid.userId } });

        if (sellerWallet && buyerWallet) {
          const totalValue = Number(winningBid.amount) * Number(winningBid.quantity);

          await prisma.$transaction([
            prisma.auction.update({
              where: { id: auction.id },
              data: { status: 'COMPLETED' },
            }),
            prisma.trade.create({
              data: {
                buyerId: winningBid.userId,
                sellerId: auction.sellerId,
                productId: auction.productId,
                quantity: winningBid.quantity,
                pricePerUnit: winningBid.amount,
                totalValue,
                buyerFee: auction.feeUsd,
                sellerFee: 0,
                source: 'auction',
                referenceId: auction.id,
              },
            }),
            prisma.wallet.update({
              where: { id: buyerWallet.id },
              data: {
                frozenUsd: { decrement: totalValue },
                balanceCredits: { increment: Number(winningBid.quantity) },
                totalTraded: { increment: totalValue },
              },
            }),
            prisma.wallet.update({
              where: { id: sellerWallet.id },
              data: {
                frozenCredits: { decrement: Number(auction.quantity) },
                balanceUsd: { increment: totalValue - Number(auction.feeUsd) },
                totalTraded: { increment: totalValue },
              },
            }),
            prisma.transaction.create({
              data: {
                walletId: buyerWallet.id,
                type: 'TRADE_BUY',
                status: 'COMPLETED',
                amountUsd: totalValue,
                amountCredits: Number(winningBid.quantity),
                referenceId: auction.id,
                referenceType: 'auction',
                description: `Auction won: ${Number(winningBid.quantity)} credits`,
              },
            }),
            prisma.transaction.create({
              data: {
                walletId: sellerWallet.id,
                type: 'TRADE_SELL',
                status: 'COMPLETED',
                amountUsd: totalValue - Number(auction.feeUsd),
                amountCredits: 0,
                referenceId: auction.id,
                referenceType: 'auction',
                description: `Auction sold: ${Number(winningBid.quantity)} credits`,
              },
            }),
          ]);

          await prisma.notification.create({
            data: {
              userId: winningBid.userId,
              type: 'AUCTION_WON',
              title: 'Auction Won!',
              message: `You won the auction and received ${Number(winningBid.quantity)} credits.`,
              data: { auctionId: auction.id },
            },
          });
        }
      } else {
        await prisma.auction.update({
          where: { id: auction.id },
          data: { status: 'EXPIRED' },
        });

        const sellerWallet = await prisma.wallet.findUnique({ where: { userId: auction.sellerId } });
        if (sellerWallet) {
          await prisma.wallet.update({
            where: { id: sellerWallet.id },
            data: {
              frozenCredits: { decrement: Number(auction.quantity) },
              balanceCredits: { increment: Number(auction.quantity) },
            },
          });
        }
      }

      for (const bid of auction.bids) {
        if (!winningBid || bid.id !== winningBid.id) {
          const bidWallet = await prisma.wallet.findUnique({ where: { userId: bid.userId } });
          if (bidWallet) {
            const bidTotal = Number(bid.amount) * Number(bid.quantity);
            await prisma.wallet.update({
              where: { id: bidWallet.id },
              data: {
                frozenUsd: { decrement: bidTotal },
                balanceUsd: { increment: bidTotal },
              },
            });
          }
        }
      }

      settled++;
    }

    return success({ settled, activated, timestamp: now.toISOString() });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to settle auctions');
  }
}
