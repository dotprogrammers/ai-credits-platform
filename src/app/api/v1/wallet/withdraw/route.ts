import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { withdrawSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = withdrawSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const wallet = await prisma.wallet.findUnique({ where: { userId: currentUser.id } });
    if (!wallet) return error('NOT_FOUND', 'Wallet not found');

    if (wallet.balanceUsd.toNumber() < parsed.data.amountUsd) {
      return error('INSUFFICIENT_FUNDS', 'Insufficient balance for withdrawal');
    }

    const [withdrawal] = await prisma.$transaction([
      prisma.withdrawal.create({
        data: {
          walletId: wallet.id,
          userId: currentUser.id,
          amountUsd: parsed.data.amountUsd,
          method: parsed.data.method,
          destination: parsed.data.destination,
          network: parsed.data.network,
          status: 'PENDING',
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceUsd: { decrement: parsed.data.amountUsd },
          frozenUsd: { increment: parsed.data.amountUsd },
        },
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          amountUsd: parsed.data.amountUsd,
          amountCredits: 0,
          referenceType: 'withdrawal',
          description: `Withdrawal via ${parsed.data.method} to ${parsed.data.destination}`,
        },
      }),
    ]);

    return created(withdrawal);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to create withdrawal');
  }
}
