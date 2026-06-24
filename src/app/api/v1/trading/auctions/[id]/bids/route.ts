import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { placeBidSchema, paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(_request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 50,
    });

    const [bids, total] = await Promise.all([
      prisma.auctionBid.findMany({
        where: { auctionId: id },
        include: { user: { select: { id: true, username: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { amount: 'desc' },
      }),
      prisma.auctionBid.count({ where: { auctionId: id } }),
    ]);

    return success(bids, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch bids');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = placeBidSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) return error('NOT_FOUND', 'Auction not found');
    if (auction.status !== 'ACTIVE') return error('CONFLICT', 'Auction is not active');
    if (auction.sellerId === currentUser.id) return error('CONFLICT', 'Cannot bid on your own auction');

    if (parsed.data.amount <= Number(auction.currentPrice)) {
      return error('INVALID_BID', 'Bid must be higher than current price');
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    const bidTotal = parsed.data.amount * parsed.data.quantity;
    if (wallet.balanceUsd.toNumber() < bidTotal) {
      return error('INSUFFICIENT_FUNDS', 'Insufficient balance for bid');
    }

    const bid = await prisma.$transaction(async (tx) => {
      const previousWinning = await tx.auctionBid.findFirst({
        where: { auctionId: id, isWinning: true },
      });

      if (previousWinning) {
        await tx.auctionBid.update({
          where: { id: previousWinning.id },
          data: { isWinning: false },
        });
      }

      const newBid = await tx.auctionBid.create({
        data: {
          auctionId: id,
          userId: currentUser.id,
          amount: parsed.data.amount,
          quantity: parsed.data.quantity,
          isWinning: true,
        },
      });

      await tx.auction.update({
        where: { id },
        data: {
          currentPrice: parsed.data.amount,
          bidCount: { increment: 1 },
          winningBidId: newBid.id,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceUsd: { decrement: bidTotal },
          frozenUsd: { increment: bidTotal },
        },
      });

      return newBid;
    });

    return created(bid);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to place bid');
  }
}
