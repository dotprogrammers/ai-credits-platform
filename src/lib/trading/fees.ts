import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import {
  DEFAULT_TRADE_COMMISSION,
  DEFAULT_AUCTION_FEE_USD,
  MIN_COMMISSION_USD,
  MAX_COMMISSION_USD,
} from "@/lib/constants";

type FeeType = "trade" | "auction";

/**
 * Calculate the commission/fee for a transaction.
 * Uses the active commission configuration from the database.
 */
export function calculateFee(
  tradeValue: number,
  type: FeeType,
  config?: FeeConfig
): number {
  const cfg = config ?? getDefaultConfig();

  if (type === "auction") {
    return Math.min(
      Math.max(cfg.auctionFee, cfg.minCommission),
      cfg.maxCommission
    );
  }

  // Trade commission
  let fee = tradeValue * cfg.tradeCommission;
  fee = Math.max(fee, cfg.minCommission);
  fee = Math.min(fee, cfg.maxCommission);

  return Math.round(fee * 10000) / 10000; // 4 decimal places
}

interface FeeConfig {
  tradeCommission: number;
  auctionFee: number;
  minCommission: number;
  maxCommission: number;
  affiliateRate: number;
}

function getDefaultConfig(): FeeConfig {
  return {
    tradeCommission: DEFAULT_TRADE_COMMISSION,
    auctionFee: DEFAULT_AUCTION_FEE_USD,
    minCommission: MIN_COMMISSION_USD,
    maxCommission: MAX_COMMISSION_USD,
    affiliateRate: 0.02,
  };
}

/**
 * Load the active fee configuration from the database.
 */
export async function getActiveFeeConfig(): Promise<FeeConfig> {
  const config = await prisma.commissionConfig.findFirst({
    where: { isActive: true },
    orderBy: { effectiveFrom: "desc" },
  });

  if (!config) {
    return getDefaultConfig();
  }

  return {
    tradeCommission: config.tradeCommission.toNumber(),
    auctionFee: config.auctionFee.toNumber(),
    minCommission: config.minCommission.toNumber(),
    maxCommission: config.maxCommission.toNumber(),
    affiliateRate: config.affiliateRate.toNumber(),
  };
}

/**
 * Calculate the fee for a trade with full Decimal precision.
 */
export function calculateTradeFee(
  tradeValue: Decimal,
  commissionRate: number,
  minFee: number,
  maxFee: number
): Decimal {
  let fee = tradeValue.times(commissionRate);
  const minDecimal = new Decimal(minFee);
  const maxDecimal = new Decimal(maxFee);

  if (fee.lt(minDecimal)) fee = minDecimal;
  if (fee.gt(maxDecimal)) fee = maxDecimal;

  return fee.toDecimalPlaces(4);
}

/**
 * Calculate the affiliate commission for a trade.
 */
export function calculateAffiliateCommission(
  tradeValue: Decimal,
  affiliateRate: number
): Decimal {
  return tradeValue.times(affiliateRate).toDecimalPlaces(4);
}

/**
 * Calculate the platform fee (total fee minus affiliate commission).
 */
export function calculatePlatformFee(
  tradeValue: Decimal,
  totalFee: Decimal,
  affiliateCommission: Decimal
): Decimal {
  return totalFee.minus(affiliateCommission);
}

/**
 * Get a summary of fees for a given trade value.
 */
export async function getFeeBreakdown(tradeValue: Decimal): Promise<{
  tradeValue: Decimal;
  commissionRate: number;
  totalFee: Decimal;
  affiliateCommission: Decimal;
  platformFee: Decimal;
}> {
  const config = await getActiveFeeConfig();
  const totalFee = calculateTradeFee(
    tradeValue,
    config.tradeCommission,
    config.minCommission,
    config.maxCommission
  );
  const affiliateCommission = calculateAffiliateCommission(
    tradeValue,
    config.affiliateRate
  );
  const platformFee = calculatePlatformFee(tradeValue, totalFee, affiliateCommission);

  return {
    tradeValue,
    commissionRate: config.tradeCommission,
    totalFee,
    affiliateCommission,
    platformFee,
  };
}
