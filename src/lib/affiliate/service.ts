import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import {
  AFFILIATE_TIERS,
  AFFILIATE_TIER_THRESHOLDS,
  DEFAULT_AFFILIATE_RATE,
} from "@/lib/constants";

/**
 * Affiliate commission calculation service.
 */
export class AffiliateService {
  /**
   * Calculate and record affiliate commission for a trade.
   */
  async calculateCommission(params: {
    buyerId: string;
    tradeValue: Decimal;
    tradeId?: string;
  }): Promise<{
    affiliateId: string | null;
    commissionAmount: Decimal;
    recorded: boolean;
  }> {
    const { buyerId, tradeValue, tradeId } = params;

    // Find the affiliate who referred this buyer
    const user = await prisma.user.findUnique({
      where: { id: buyerId },
      select: { referredById: true },
    });

    if (!user?.referredById) {
      return { affiliateId: null, commissionAmount: new Decimal(0), recorded: false };
    }

    // Get the affiliate profile
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: user.referredById },
    });

    if (!affiliate || !affiliate.isActive) {
      return { affiliateId: null, commissionAmount: new Decimal(0), recorded: false };
    }

    // Determine commission rate based on tier
    const commissionRate = affiliate.commissionRate.toNumber();

    // Calculate commission
    const commissionAmount = tradeValue.times(commissionRate).toDecimalPlaces(4);

    if (commissionAmount.lte(0)) {
      return { affiliateId: affiliate.id, commissionAmount: new Decimal(0), recorded: false };
    }

    // Find the referral record
    const referral = await prisma.referral.findFirst({
      where: {
        affiliateId: affiliate.id,
        referredUserId: buyerId,
      },
    });

    // Record the commission
    await prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        referralId: referral?.id,
        sourceTradeId: tradeId,
        sourceUserId: buyerId,
        amountUsd: commissionAmount,
        status: "pending",
      },
    });

    // Update affiliate pending balance
    await prisma.affiliateProfile.update({
      where: { id: affiliate.id },
      data: {
        pendingBalance: affiliate.pendingBalance.plus(commissionAmount),
        totalEarnings: affiliate.totalEarnings.plus(commissionAmount),
      },
    });

    return {
      affiliateId: affiliate.id,
      commissionAmount,
      recorded: true,
    };
  }

  /**
   * Get an affiliate's profile and stats.
   */
  async getAffiliateProfile(userId: string) {
    return prisma.affiliateProfile.findUnique({
      where: { userId },
      include: {
        commissions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        referrals: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        payouts: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  /**
   * Get the commission rate for an affiliate based on their tier and total referrals.
   */
  getCommissionRate(totalReferrals: number): number {
    if (totalReferrals >= AFFILIATE_TIER_THRESHOLDS.platinum) {
      return AFFILIATE_TIERS.platinum.rate;
    }
    if (totalReferrals >= AFFILIATE_TIER_THRESHOLDS.gold) {
      return AFFILIATE_TIERS.gold.rate;
    }
    if (totalReferrals >= AFFILIATE_TIER_THRESHOLDS.silver) {
      return AFFILIATE_TIERS.silver.rate;
    }
    return AFFILIATE_TIERS.standard.rate;
  }

  /**
   * Update affiliate tier based on referral count.
   */
  async updateTier(affiliateId: string): Promise<void> {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
    });

    if (!affiliate) return;

    const newRate = this.getCommissionRate(affiliate.totalReferrals);
    let newTier = "standard";

    if (affiliate.totalReferrals >= AFFILIATE_TIER_THRESHOLDS.platinum) {
      newTier = "platinum";
    } else if (affiliate.totalReferrals >= AFFILIATE_TIER_THRESHOLDS.gold) {
      newTier = "gold";
    } else if (affiliate.totalReferrals >= AFFILIATE_TIER_THRESHOLDS.silver) {
      newTier = "silver";
    }

    await prisma.affiliateProfile.update({
      where: { id: affiliateId },
      data: {
        tier: newTier,
        commissionRate: newRate,
      },
    });
  }

  /**
   * Record a new referral.
   */
  async recordReferral(affiliateUserId: string, referredUserId: string): Promise<void> {
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: affiliateUserId },
    });

    if (!affiliate) return;

    await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId,
        status: "pending",
      },
    });

    await prisma.affiliateProfile.update({
      where: { id: affiliate.id },
      data: {
        totalReferrals: { increment: 1 },
      },
    });

    // Check if tier should be upgraded
    await this.updateTier(affiliate.id);
  }

  /**
   * Mark a referral as converted (when the referred user makes their first trade).
   */
  async markReferralConverted(affiliateUserId: string, referredUserId: string): Promise<void> {
    await prisma.referral.updateMany({
      where: {
        affiliate: { userId: affiliateUserId },
        referredUserId,
        status: "pending",
      },
      data: {
        status: "converted",
        convertedAt: new Date(),
      },
    });
  }
}

export const affiliateService = new AffiliateService();
