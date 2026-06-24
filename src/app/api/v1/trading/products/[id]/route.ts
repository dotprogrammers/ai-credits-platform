import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound } from '@/lib/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.creditProduct.findUnique({
      where: { id },
      include: {
        provider: {
          select: {
            id: true,
            type: true,
            name: true,
            displayName: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!product) return notFound('Product not found');

    return success(product);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch product');
  }
}
