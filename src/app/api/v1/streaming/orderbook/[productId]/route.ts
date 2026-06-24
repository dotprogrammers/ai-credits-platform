import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        while (true) {
          const [bids, asks, lastTrade] = await Promise.all([
            prisma.order.findMany({
              where: {
                productId,
                side: 'BUY',
                status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
              },
              orderBy: [{ pricePerUnit: 'desc' }, { createdAt: 'asc' }],
              take: 20,
              select: {
                id: true,
                pricePerUnit: true,
                quantity: true,
                filledQuantity: true,
              },
            }),
            prisma.order.findMany({
              where: {
                productId,
                side: 'SELL',
                status: { in: ['OPEN', 'PARTIALLY_FILLED'] },
              },
              orderBy: [{ pricePerUnit: 'asc' }, { createdAt: 'asc' }],
              take: 20,
              select: {
                id: true,
                pricePerUnit: true,
                quantity: true,
                filledQuantity: true,
              },
            }),
            prisma.trade.findFirst({
              where: { productId },
              orderBy: { createdAt: 'desc' },
              select: { pricePerUnit: true, quantity: true, createdAt: true },
            }),
          ]);

          send({
            type: 'orderbook',
            productId,
            data: {
              bids: bids.map((b) => ({
                id: b.id,
                price: Number(b.pricePerUnit),
                quantity: Number(b.quantity) - Number(b.filledQuantity),
              })),
              asks: asks.map((a) => ({
                id: a.id,
                price: Number(a.pricePerUnit),
                quantity: Number(a.quantity) - Number(a.filledQuantity),
              })),
              lastTrade: lastTrade
                ? {
                    price: Number(lastTrade.pricePerUnit),
                    quantity: Number(lastTrade.quantity),
                    at: lastTrade.createdAt,
                  }
                : null,
              timestamp: new Date().toISOString(),
            },
          });

          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
