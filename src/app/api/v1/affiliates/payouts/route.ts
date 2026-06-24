import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';
import { z } from 'zod';

const payoutRequestSchema = z.object({
  amountUsd: z.number().positive(),
  method: z.string(),
});

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

    const [payouts, total] = await Promise.all([
      prisma.affiliatePayout.findMany({
        where: { affiliateId: profile.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.affiliatePayout.count({ where: { affiliateId: profile.id } }),
    ]);

    return success(payouts, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch payouts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = payoutRequestSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: currentUser.id },
    });
    if (!profile) return error('NOT_FOUND', 'Affiliate profile not found');

    if (profile.pendingBalance.toNumber() < parsed.data.amountUsd) {
      return error('INSUFFICIENT_FUNDS', 'Insufficient pending balance');
    }

    const payout = await prisma.$transaction(async (tx) => {
      const newPayout = await tx.affiliatePayout.create({
        data: {
          affiliateId: profile.id,
          amountUsd: parsed.data.amountUsd,
          method: parsed.data.method,
          status: 'pending',
        },
      });

      await tx.affiliateProfile.update({
        where: { id: profile.id },
        data: { pendingBalance: { decrement: parsed.data.amountUsd } },
      });

      return newPayout;
    });

    return created(payout);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to request payout');
  }
}
