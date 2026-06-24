import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const [bids, asks] = await Promise.all([
      prisma.order.findMany({
        where: {
          productId,
          side: 'BUY',
          status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
        },
        orderBy: [{ pricePerUnit: 'desc' }, { createdAt: 'asc' }],
        take: 50,
        select: {
          id: true,
          pricePerUnit: true,
          quantity: true,
          filledQuantity: true,
          side: true,
          createdAt: true,
        },
      }),
      prisma.order.findMany({
        where: {
          productId,
          side: 'SELL',
          status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
        },
        orderBy: [{ pricePerUnit: 'asc' }, { createdAt: 'asc' }],
        take: 50,
        select: {
          id: true,
          pricePerUnit: true,
          quantity: true,
          filledQuantity: true,
          side: true,
          createdAt: true,
        },
      }),
    ]);

    const lastTrade = await prisma.trade.findFirst({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      select: { pricePerUnit: true, quantity: true, createdAt: true },
    });

    return success({
      bids: bids.map((b) => ({
        ...b,
        remainingQuantity: Number(b.quantity) - Number(b.filledQuantity),
        pricePerUnit: Number(b.pricePerUnit),
      })),
      asks: asks.map((a) => ({
        ...a,
        remainingQuantity: Number(a.quantity) - Number(a.filledQuantity),
        pricePerUnit: Number(a.pricePerUnit),
      })),
      lastTrade: lastTrade
        ? { pricePerUnit: Number(lastTrade.pricePerUnit), quantity: Number(lastTrade.quantity), createdAt: lastTrade.createdAt }
        : null,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch order book');
  }
}
