import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, notFound, validationError } from '@/lib/api-response';
import { requireAdmin } from '@/lib/session';
import { z } from 'zod';

const payoutActionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  reference: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();

    const body = await request.json();
    const parsed = payoutActionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.flatten());

    const payout = await prisma.affiliatePayout.findUnique({ where: { id } });
    if (!payout) return notFound('Payout not found');
    if (payout.status !== 'pending') return error('CONFLICT', 'Payout is not pending');

    const updated = await prisma.affiliatePayout.update({
      where: { id },
      data: {
        status: parsed.data.status,
        reference: parsed.data.reference,
        processedAt: new Date(),
      },
    });

    if (parsed.data.status === 'rejected') {
      await prisma.affiliateProfile.update({
        where: { id: payout.affiliateId },
        data: { pendingBalance: { increment: Number(payout.amountUsd) } },
      });
    }

    return success(updated);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to process payout');
  }
}
