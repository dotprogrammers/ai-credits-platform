import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        while (true) {
          const [stats, recentTrades, activeAuctions] = await Promise.all([
            prisma.platformStats.findUnique({ where: { id: 'singleton' } }),
            prisma.trade.findMany({
              take: 5,
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                totalValue: true,
                quantity: true,
                pricePerUnit: true,
                productId: true,
                createdAt: true,
              },
            }),
            prisma.auction.count({ where: { status: 'ACTIVE' } }),
          ]);

          const productIds = [...new Set(recentTrades.map((t) => t.productId))];
          const products = await prisma.creditProduct.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, slug: true },
          });
          const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

          send({
            type: 'stats',
            data: {
              totalVolumeUsd: stats ? Number(stats.totalVolumeUsd) : 0,
              totalTrades: stats?.totalTrades ?? 0,
              activeTraders: stats?.activeTraders ?? 0,
              totalUsers: stats?.totalUsers ?? 0,
              activeAuctions,
              recentTrades: recentTrades.map((t) => ({
                id: t.id,
                product: productMap[t.productId]?.name ?? null,
                totalValue: Number(t.totalValue),
                quantity: Number(t.quantity),
                pricePerUnit: Number(t.pricePerUnit),
                createdAt: t.createdAt,
              })),
              timestamp: new Date().toISOString(),
            },
          });

          await new Promise((resolve) => setTimeout(resolve, 5000));
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
