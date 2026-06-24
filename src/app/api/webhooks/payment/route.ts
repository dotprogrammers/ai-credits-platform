import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { z } from 'zod';

const paymentWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    depositId: z.string().optional(),
    externalRef: z.string().optional(),
    status: z.enum(['completed', 'failed', 'pending']),
    amount: z.number().optional(),
  }),
  signature: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = paymentWebhookSchema.safeParse(body);

    if (!parsed.success) {
      return error('VALIDATION_ERROR', 'Invalid webhook payload');
    }

    const { data } = parsed.data;

    const deposit = data.depositId
      ? await prisma.deposit.findUnique({ where: { id: data.depositId } })
      : data.externalRef
        ? await prisma.deposit.findFirst({ where: { externalRef: data.externalRef } })
        : null;

    if (!deposit) {
      return error('NOT_FOUND', 'Deposit not found');
    }

    if (deposit.status !== 'PENDING') {
      return success({ message: 'Deposit already processed', depositId: deposit.id });
    }

    if (data.status === 'completed') {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: deposit.id },
          data: { status: 'COMPLETED', completedAt: new Date() },
        }),
        prisma.wallet.update({
          where: { id: deposit.walletId },
          data: {
            balanceUsd: { increment: Number(deposit.amountUsd) },
            totalDeposited: { increment: Number(deposit.amountUsd) },
          },
        }),
        prisma.transaction.updateMany({
          where: { referenceId: deposit.id, referenceType: 'deposit' },
          data: { status: 'COMPLETED', completedAt: new Date() },
        }),
      ]);

      await prisma.notification.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT_CONFIRMED',
          title: 'Deposit Confirmed',
          message: `Your deposit of $${Number(deposit.amountUsd).toFixed(2)} has been confirmed.`,
        },
      });
    } else if (data.status === 'failed') {
      await prisma.$transaction([
        prisma.deposit.update({
          where: { id: deposit.id },
          data: { status: 'FAILED' },
        }),
        prisma.transaction.updateMany({
          where: { referenceId: deposit.id, referenceType: 'deposit' },
          data: { status: 'FAILED' },
        }),
      ]);
    }

    return success({ processed: true, depositId: deposit.id });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to process webhook');
  }
}
