import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { depositSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = depositSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    const deposit = await prisma.deposit.create({
      data: {
        walletId: wallet.id,
        userId: currentUser.id,
        amountUsd: parsed.data.amountUsd,
        method: parsed.data.method,
        externalRef: parsed.data.externalRef,
        status: 'PENDING',
      },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        status: 'PENDING',
        amountUsd: parsed.data.amountUsd,
        amountCredits: 0,
        referenceId: deposit.id,
        referenceType: 'deposit',
        description: `Deposit via ${parsed.data.method}`,
      },
    });

    return created(deposit);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create deposit');
  }
}
