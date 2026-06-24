import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        username: true,
        image: true,
        role: true,
        status: true,
        phone: true,
        country: true,
        referralCode: true,
        twoFactorEnabled: true,
        createdAt: true,
        wallet: {
          select: {
            balanceUsd: true,
            balanceCredits: true,
            frozenUsd: true,
            frozenCredits: true,
          },
        },
        kycRecord: {
          select: { status: true },
        },
      },
    });

    if (!user) return error('NOT_FOUND', 'User not found');

    return success(user);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch user');
  }
}
