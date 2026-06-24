import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';

export async function GET(_request: NextRequest) {
  try {
    const stats = await prisma.platformStats.findUnique({ where: { id: 'singleton' } });

    const recentTrades = await prisma.trade.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const topProducts = await prisma.trade.groupBy({
      by: ['productId'],
      _sum: { totalValue: true, quantity: true },
      _count: { id: true },
      orderBy: { _sum: { totalValue: 'desc' } },
      take: 10,
    });

    const allProductIds = [
      ...new Set([...recentTrades.map((t) => t.productId), ...topProducts.map((p) => p.productId)]),
    ];
    const products = await prisma.creditProduct.findMany({
      where: { id: { in: allProductIds } },
      select: { id: true, name: true, slug: true, creditUnit: true },
    });

    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    return success({
      platform: stats
        ? {
            totalVolumeUsd: Number(stats.totalVolumeUsd),
            totalTrades: stats.totalTrades,
            activeTraders: stats.activeTraders,
            totalCreditsTraded: Number(stats.totalCreditsTraded),
            totalUsers: stats.totalUsers,
          }
        : null,
      recentTrades: recentTrades.map((t) => ({
        id: t.id,
        product: productMap[t.productId]?.name ?? null,
        quantity: Number(t.quantity),
        pricePerUnit: Number(t.pricePerUnit),
        totalValue: Number(t.totalValue),
        createdAt: t.createdAt,
      })),
      topProducts: topProducts.map((p) => ({
        product: productMap[p.productId] ?? null,
        totalVolume: p._sum.totalValue ? Number(p._sum.totalValue) : 0,
        totalQuantity: p._sum.quantity ? Number(p._sum.quantity) : 0,
        tradeCount: p._count.id,
      })),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch stats');
  }
}
