import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: currentUser.id },
    });

    if (!profile) {
      return success({
        referralCode: (await prisma.user.findUnique({
          where: { id: currentUser.id },
          select: { referralCode: true },
        }))?.referralCode,
        affiliateProfile: null,
        message: 'You are not enrolled in the affiliate program',
      });
    }

    const recentCommissions = await prisma.affiliateCommission.findMany({
      where: { affiliateId: profile.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const recentPayouts = await prisma.affiliatePayout.findMany({
      where: { affiliateId: profile.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return success({
      profile: {
        commissionRate: Number(profile.commissionRate),
        totalReferrals: profile.totalReferrals,
        totalEarnings: Number(profile.totalEarnings),
        totalPaid: Number(profile.totalPaid),
        pendingBalance: Number(profile.pendingBalance),
        tier: profile.tier,
        isActive: profile.isActive,
      },
      recentCommissions,
      recentPayouts,
    });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch affiliate data');
  }
}
