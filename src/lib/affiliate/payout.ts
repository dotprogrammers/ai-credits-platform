import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import { AFFILIATE_MIN_PAYOUT_USD } from "@/lib/constants";
import { BadRequestError } from "@/lib/errors";

/**
 * Affiliate payout processing.
 */
export class AffiliatePayoutService {
  /**
   * Request a payout for an affiliate.
   */
  async requestPayout(params: {
    affiliateUserId: string;
    amountUsd: Decimal;
    method: string;
  }): Promise<{ payoutId: string }> {
    const { affiliateUserId, amountUsd, method } = params;

    if (amountUsd.lt(AFFILIATE_MIN_PAYOUT_USD)) {
      throw new BadRequestError(
        `Minimum payout amount is $${AFFILIATE_MIN_PAYOUT_USD}`
      );
    }

    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: affiliateUserId },
    });

    if (!affiliate) {
      throw new BadRequestError("Affiliate profile not found");
    }

    if (!affiliate.isActive) {
      throw new BadRequestError("Affiliate account is not active");
    }

    if (affiliate.pendingBalance.lt(amountUsd)) {
      throw new BadRequestError(
        `Insufficient pending balance. Available: $${affiliate.pendingBalance.toFixed(2)}`
      );
    }

    // Create the payout record
    const payout = await prisma.affiliatePayout.create({
      data: {
        affiliateId: affiliate.id,
        amountUsd,
        status: "pending",
        method,
      },
    });

    // Deduct from pending balance
    await prisma.affiliateProfile.update({
      where: { id: affiliate.id },
      data: {
        pendingBalance: affiliate.pendingBalance.minus(amountUsd),
      },
    });

    return { payoutId: payout.id };
  }

  /**
   * Process a pending payout (admin action).
   */
  async processPayout(payoutId: string): Promise<void> {
    const payout = await prisma.affiliatePayout.findUnique({
      where: { id: payoutId },
      include: { affiliate: true },
    });

    if (!payout) {
      throw new BadRequestError("Payout not found");
    }

    if (payout.status !== "pending") {
      throw new BadRequestError("Payout is not in pending status");
    }

    // Mark as processed
    await prisma.affiliatePayout.update({
      where: { id: payoutId },
      data: {
        status: "completed",
        processedAt: new Date(),
      },
    });

    // Update affiliate totals
    await prisma.affiliateProfile.update({
      where: { id: payout.affiliateId },
      data: {
        totalPaid: payout.affiliate.totalPaid.plus(payout.amountUsd),
      },
    });
  }

  /**
   * Cancel a pending payout and refund the balance.
   */
  async cancelPayout(payoutId: string): Promise<void> {
    const payout = await prisma.affiliatePayout.findUnique({
      where: { id: payoutId },
      include: { affiliate: true },
    });

    if (!payout) {
      throw new BadRequestError("Payout not found");
    }

    if (payout.status !== "pending") {
      throw new BadRequestError("Only pending payouts can be cancelled");
    }

    // Mark as cancelled
    await prisma.affiliatePayout.update({
      where: { id: payoutId },
      data: { status: "cancelled" },
    });

    // Refund to pending balance
    await prisma.affiliateProfile.update({
      where: { id: payout.affiliateId },
      data: {
        pendingBalance: payout.affiliate.pendingBalance.plus(payout.amountUsd),
      },
    });
  }

  /**
   * Get payout history for an affiliate.
   */
  async getPayoutHistory(affiliateUserId: string, page = 1, limit = 20) {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: affiliateUserId },
    });

    if (!affiliate) {
      return { payouts: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      prisma.affiliatePayout.findMany({
        where: { affiliateId: affiliate.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliatePayout.count({
        where: { affiliateId: affiliate.id },
      }),
    ]);

    return {
      payouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Confirm a commission (e.g., after a trade is fully settled).
   */
  async confirmCommission(commissionId: string): Promise<void> {
    await prisma.affiliateCommission.update({
      where: { id: commissionId },
      data: {
        status: "confirmed",
        confirmedAt: new Date(),
      },
    });
  }

  /**
   * Get pending commissions for an affiliate.
   */
  async getPendingCommissions(affiliateUserId: string) {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: affiliateUserId },
    });

    if (!affiliate) return [];

    return prisma.affiliateCommission.findMany({
      where: {
        affiliateId: affiliate.id,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const affiliatePayoutService = new AffiliatePayoutService();
