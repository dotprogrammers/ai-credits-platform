import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { paginationSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const providerId = searchParams.get('providerId');
    const providerType = searchParams.get('providerType');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (providerId) where.providerId = providerId;
    if (providerType) where.providerType = providerType;
    if (active === 'true') where.isActive = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.creditProduct.findMany({
        where,
        include: {
          provider: { select: { id: true, displayName: true, logoUrl: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.creditProduct.count({ where }),
    ]);

    return success(products, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch products');
  }
}
