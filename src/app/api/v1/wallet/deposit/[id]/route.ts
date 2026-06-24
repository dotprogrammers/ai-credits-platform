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

    const deposit = await prisma.deposit.findFirst({
      where: { id, userId: currentUser.id },
      include: { wallet: { select: { userId: true } } },
    });

    if (!deposit) return notFound('Deposit not found');

    return success(deposit);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch deposit');
  }
}
