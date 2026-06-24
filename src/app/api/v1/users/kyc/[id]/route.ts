import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, validationError, notFound } from '@/lib/api-response';
import { kycReviewSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();
    const body = await request.json();
    const parsed = kycReviewSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const kyc = await prisma.kycRecord.findUnique({ where: { id } });
    if (!kyc) return notFound('KYC record not found');

    if (kyc.status !== 'PENDING') {
      return error('CONFLICT', 'KYC record is not pending review');
    }

    const updated = await prisma.kycRecord.update({
      where: { id },
      data: {
        status: parsed.data.status,
        rejectionReason: parsed.data.rejectionReason,
        reviewedAt: new Date(),
        reviewedById: admin.id,
      },
    });

    if (parsed.data.status === 'VERIFIED') {
      await prisma.user.update({
        where: { id: kyc.userId },
        data: { status: 'ACTIVE' },
      });
    }

    return success(updated);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to review KYC');
  }
}
