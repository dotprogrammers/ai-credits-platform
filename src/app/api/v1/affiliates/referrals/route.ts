import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: currentUser.id },
    });
    if (!profile) return error('NOT_FOUND', 'Affiliate profile not found');

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where: { affiliateId: profile.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.referral.count({ where: { affiliateId: profile.id } }),
    ]);

    const referralIds = referrals.map((r) => r.referredUserId);
    const referredUsers = await prisma.user.findMany({
      where: { id: { in: referralIds } },
      select: { id: true, name: true, username: true, email: true, createdAt: true },
    });
    const userMap = Object.fromEntries(referredUsers.map((u) => [u.id, u]));

    const enriched = referrals.map((r) => ({
      ...r,
      referredUser: userMap[r.referredUserId] ?? null,
    }));

    return success(enriched, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch referrals');
  }
}
