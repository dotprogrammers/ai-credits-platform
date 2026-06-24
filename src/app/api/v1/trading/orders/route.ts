import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { createOrderSchema, paginationSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const { searchParams } = new URL(request.url);

    const { page, limit } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 20,
    });

    const status = searchParams.get('status');
    const productId = searchParams.get('productId');
    const side = searchParams.get('side');

    const where: Record<string, unknown> = { userId: currentUser.id };
    if (status) where.status = status;
    if (productId) where.productId = productId;
    if (side) where.side = side;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, slug: true, creditUnit: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return success(orders, { page, limit, total });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch orders');
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const product = await prisma.creditProduct.findUnique({
      where: { id: parsed.data.productId },
    });
    if (!product || !product.isActive) return error('NOT_FOUND', 'Product not found or inactive');

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    const totalValue = parsed.data.pricePerUnit * parsed.data.quantity;

    if (parsed.data.side === 'BUY') {
      if (wallet.balanceUsd.toNumber() < totalValue) {
        return error('INSUFFICIENT_FUNDS', 'Insufficient balance');
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: currentUser.id,
        productId: parsed.data.productId,
        side: parsed.data.side,
        type: parsed.data.type,
        pricePerUnit: parsed.data.pricePerUnit,
        quantity: parsed.data.quantity,
        totalValue,
      },
    });

    if (parsed.data.side === 'BUY') {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceUsd: { decrement: totalValue },
          frozenUsd: { increment: totalValue },
        },
      });
    }

    return created(order);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create order');
  }
}
