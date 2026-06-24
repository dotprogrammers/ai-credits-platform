import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound } from '@/lib/api-response';
import { requireAuth } from '@/lib/session';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth();

    const order = await prisma.order.findFirst({
      where: { id, userId: currentUser.id },
      include: {
        product: { select: { id: true, name: true, slug: true, creditUnit: true } },
        fills: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) return notFound('Order not found');
    return success(order);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch order');
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await requireAuth();

    const order = await prisma.order.findFirst({
      where: { id, userId: currentUser.id },
    });

    if (!order) return notFound('Order not found');
    if (order.status !== 'OPEN' && order.status !== 'PARTIALLY_FILLED') {
      return error('CONFLICT', 'Order cannot be cancelled in its current state');
    }

    const remainingQuantity = Number(order.quantity) - Number(order.filledQuantity);
    const refundAmount = remainingQuantity * Number(order.pricePerUnit);

    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      }),
      ...(order.side === 'BUY'
        ? [
            prisma.wallet.update({
              where: { userId: currentUser.id },
              data: {
                frozenUsd: { decrement: refundAmount },
                balanceUsd: { increment: refundAmount },
              },
            }),
          ]
        : []),
    ]);

    return success(updatedOrder);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to cancel order');
  }
}
