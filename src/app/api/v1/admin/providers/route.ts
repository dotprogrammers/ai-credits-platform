import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { createProviderSchema, paginationSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const [providers, total] = await Promise.all([
      prisma.provider.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.provider.count(),
    ]);

    return success(providers, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch providers');
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = createProviderSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const provider = await prisma.provider.create({ data: parsed.data });
    return created(provider);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create provider');
  }
}
