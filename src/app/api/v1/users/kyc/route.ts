import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, created, error, validationError } from '@/lib/api-response';
import { kycSubmitSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    const body = await request.json();
    const parsed = kycSubmitSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const existing = await prisma.kycRecord.findUnique({ where: { userId: currentUser.id } });
    if (existing && existing.status === 'PENDING') {
      return error('CONFLICT', 'KYC review is already pending');
    }
    if (existing && existing.status === 'VERIFIED') {
      return error('CONFLICT', 'KYC is already verified');
    }

    const kyc = await prisma.kycRecord.upsert({
      where: { userId: currentUser.id },
      update: {
        ...parsed.data,
        dateOfBirth: new Date(parsed.data.dateOfBirth),
        status: 'PENDING',
        submittedAt: new Date(),
      },
      create: {
        userId: currentUser.id,
        ...parsed.data,
        dateOfBirth: new Date(parsed.data.dateOfBirth),
        status: 'PENDING',
        submittedAt: new Date(),
      },
    });

    return created(kyc);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to submit KYC');
  }
}

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const kyc = await prisma.kycRecord.findUnique({
      where: { userId: currentUser.id },
    });

    return success(kyc ?? { status: 'NOT_SUBMITTED' });
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch KYC status');
  }
}
