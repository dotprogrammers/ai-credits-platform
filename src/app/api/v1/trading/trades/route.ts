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

    const productId = searchParams.get('productId');

    const where = productId
      ? { productId, OR: [{ buyerId: currentUser.id }, { sellerId: currentUser.id }] }
      : { OR: [{ buyerId: currentUser.id }, { sellerId: currentUser.id }] };

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.trade.count({ where }),
    ]);

    const productIds = [...new Set(trades.map((t) => t.productId))];
    const products = await prisma.creditProduct.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, slug: true, creditUnit: true },
    });
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

    const enriched = trades.map((t) => ({
      ...t,
      product: productMap[t.productId] ?? null,
    }));

    return success(enriched, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch trades');
  }
}
