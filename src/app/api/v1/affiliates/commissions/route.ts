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

    const status = searchParams.get('status');
    const where: Record<string, unknown> = { affiliateId: profile.id };
    if (status) where.status = status;

    const [commissions, total] = await Promise.all([
      prisma.affiliateCommission.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.affiliateCommission.count({ where }),
    ]);

    return success(commissions, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch commissions');
  }
}
