import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, error, validationError } from '@/lib/api-response';
import { updateCommissionSchema } from '@/lib/validations';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    await requireAdmin();

    const configs = await prisma.commissionConfig.findMany({
      orderBy: { effectiveFrom: 'desc' },
      take: 10,
    });

    return success(configs);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to fetch commission config');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = updateCommissionSchema.safeParse(body);

    if (!parsed.success) return validationError(parsed.error.flatten());

    const current = await prisma.commissionConfig.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (current) {
      const updated = await prisma.commissionConfig.update({
        where: { id: current.id },
        data: parsed.data,
      });
      return success(updated);
    }

    const created = await prisma.commissionConfig.create({
      data: {
        tradeCommission: parsed.data.tradeCommission ?? 0.0025,
        auctionFee: parsed.data.auctionFee ?? 1.0,
        minCommission: parsed.data.minCommission ?? 0.01,
        maxCommission: parsed.data.maxCommission ?? 100.0,
        affiliateRate: parsed.data.affiliateRate ?? 0.02,
      },
    });

    return success(created);
  } catch (err) {
    if (err instanceof Response) return err;
    return error('INTERNAL_ERROR', 'Failed to update commission config');
  }
}
