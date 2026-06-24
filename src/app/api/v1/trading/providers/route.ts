import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (active === 'true') where.isActive = true;

    const providers = await prisma.provider.findMany({
      where,
      orderBy: { displayName: 'asc' },
      select: {
        id: true,
        type: true,
        name: true,
        displayName: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        isActive: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });

    return success(providers);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch providers');
  }
}
