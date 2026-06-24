import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      activeUsers,
      totalWallets,
      totalVolume,
      totalTrades,
      pendingKyc,
      pendingWithdrawals,
      pendingDeposits,
      activeAuctions,
      totalBlogPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.wallet.aggregate({ _sum: { balanceUsd: true, balanceCredits: true } }),
      prisma.trade.aggregate({ _sum: { totalValue: true } }),
      prisma.trade.count(),
      prisma.kycRecord.count({ where: { status: 'PENDING' } }),
      prisma.withdrawal.count({ where: { status: 'PENDING' } }),
      prisma.deposit.count({ where: { status: 'PENDING' } }),
      prisma.auction.count({ where: { status: 'ACTIVE' } }),
      prisma.blogPost.count(),
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, username: true, role: true, status: true, createdAt: true },
    });

    const recentTrades = await prisma.trade.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { username: true, name: true } },
        seller: { select: { username: true, name: true } },
      },
    });

    const tradeProductIds = [...new Set(recentTrades.map((t) => t.productId))];
    const tradeProducts = await prisma.creditProduct.findMany({
      where: { id: { in: tradeProductIds } },
      select: { id: true, name: true },
    });
    const tradeProductMap = Object.fromEntries(tradeProducts.map((p) => [p.id, p]));

    return success({
      overview: {
        totalUsers,
        activeUsers,
        totalBalanceUsd: totalWallets._sum.balanceUsd ? Number(totalWallets._sum.balanceUsd) : 0,
        totalBalanceCredits: totalWallets._sum.balanceCredits ? Number(totalWallets._sum.balanceCredits) : 0,
        totalVolumeUsd: totalVolume._sum.totalValue ? Number(totalVolume._sum.totalValue) : 0,
        totalTrades,
        pendingKyc,
        pendingWithdrawals,
        pendingDeposits,
        activeAuctions,
        totalBlogPosts,
      },
      recentUsers,
      recentTrades: recentTrades.map((t) => ({
        ...t,
        product: tradeProductMap[t.productId] ?? null,
      })),
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch admin stats');
  }
}
