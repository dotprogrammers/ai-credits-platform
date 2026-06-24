import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        while (true) {
          const [auction, topBids] = await Promise.all([
            prisma.auction.findUnique({
              where: { id },
              include: {
                product: { select: { name: true, slug: true, creditUnit: true } },
              },
            }),
            prisma.auctionBid.findMany({
              where: { auctionId: id },
              take: 10,
              orderBy: { amount: 'desc' },
              include: {
                user: { select: { id: true, username: true, name: true } },
              },
            }),
          ]);

          if (!auction) {
            send({ type: 'error', message: 'Auction not found' });
            controller.close();
            return;
          }

          send({
            type: 'auction',
            data: {
              auction: {
                id: auction.id,
                currentPrice: Number(auction.currentPrice),
                startPrice: Number(auction.startPrice),
                reservePrice: auction.reservePrice ? Number(auction.reservePrice) : null,
                bidCount: auction.bidCount,
                status: auction.status,
                endsAt: auction.endsAt,
                product: auction.product,
              },
              bids: topBids.map((b) => ({
                id: b.id,
                amount: Number(b.amount),
                quantity: Number(b.quantity),
                isWinning: b.isWinning,
                user: { id: b.user.id, username: b.user.username },
                createdAt: b.createdAt,
              })),
              timestamp: new Date().toISOString(),
            },
          });

          if (auction.status === 'COMPLETED' || auction.status === 'CANCELLED' || auction.status === 'EXPIRED') {
            controller.close();
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 3000));
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
