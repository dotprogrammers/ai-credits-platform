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

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return success([], { page, limit, total: 0 });

    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = { walletId: wallet.id };
    if (type) where.type = type;
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return success(transactions, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch transactions');
  }
}
