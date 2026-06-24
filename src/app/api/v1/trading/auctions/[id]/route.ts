import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound, validationError } from '@/lib/api-response';
import { requireAuth } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, slug: true, creditUnit: true } },
        bids: {
          take: 10,
          orderBy: { amount: 'desc' },
          include: { user: { select: { id: true, username: true, name: true } } },
        },
      },
    });

    if (!auction) return notFound('Auction not found');
    return success(auction);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch auction');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth();

    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) return notFound('Auction not found');
    if (auction.sellerId !== currentUser.id) return error('FORBIDDEN', 'Not your auction');

    const body = await request.json();

    if (body.status === 'CANCELLED' && auction.status === 'PENDING') {
      const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
      if (wallet) {
        await prisma.$transaction([
          prisma.auction.update({ where: { id }, data: { status: 'CANCELLED' } }),
          prisma.wallet.update({
            where: { id: wallet.id },
            data: {
              frozenCredits: { decrement: Number(auction.quantity) },
              balanceCredits: { increment: Number(auction.quantity) },
            },
          }),
        ]);
      }
    }

    const updated = await prisma.auction.findUnique({ where: { id } });
    return success(updated);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update auction');
  }
}
