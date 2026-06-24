import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { paginationSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const status = searchParams.get('status') ?? 'pending';

    const [payouts, total] = await Promise.all([
      prisma.affiliatePayout.findMany({
        where: { status },
        include: {
          affiliate: {
            include: {
              user: { select: { id: true, name: true, email: true, username: true } },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.affiliatePayout.count({ where: { status } }),
    ]);

    return success(payouts, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch payouts');
  }
}
