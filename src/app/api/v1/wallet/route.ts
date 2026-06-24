import { prisma } from '@/lib/prisma';
import { success, error } from '@/lib/api-response';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const currentUser = await requireAuth();

    const wallet = await prisma.wallet.findUnique({
      where: { userId: currentUser.id },
      select: {
        id: true,
        balanceUsd: true,
        balanceCredits: true,
        frozenUsd: true,
        frozenCredits: true,
        totalDeposited: true,
        totalWithdrawn: true,
        totalTraded: true,
        updatedAt: true,
      },
    });

    if (!wallet) {
      return success({
        id: null,
        balanceUsd: 0,
        balanceCredits: 0,
        frozenUsd: 0,
        frozenCredits: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalTraded: 0,
      });
    }

    return success(wallet);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch wallet');
  }
}
