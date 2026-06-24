import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import type { MarketStats } from "@/types/trading";

/**
 * Price discovery and spread calculation utilities.
 */

/**
 * Get the last traded price for a product.
 */
export async function getLastTradePrice(productId: string): Promise<Decimal | null> {
  const lastTrade = await prisma.trade.findFirst({
    where: { productId },
    orderBy: { createdAt: "desc" },
    select: { pricePerUnit: true },
  });
  return lastTrade?.pricePerUnit ?? null;
}

/**
 * Get 24h high, low, and volume for a product.
 */
export async function get24hStats(productId: string): Promise<{
  high: Decimal;
  low: Decimal;
  volume: Decimal;
  tradeCount: number;
}> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trades = await prisma.trade.findMany({
    where: {
      productId,
      createdAt: { gte: since },
    },
    select: {
      pricePerUnit: true,
      totalValue: true,
      quantity: true,
    },
  });

  if (trades.length === 0) {
    return {
      high: new Decimal(0),
      low: new Decimal(0),
      volume: new Decimal(0),
      tradeCount: 0,
    };
  }

  let high = trades[0].pricePerUnit;
  let low = trades[0].pricePerUnit;
  let volume = new Decimal(0);

  for (const trade of trades) {
    if (trade.pricePerUnit.gt(high)) high = trade.pricePerUnit;
    if (trade.pricePerUnit.lt(low)) low = trade.pricePerUnit;
    volume = volume.plus(trade.totalValue);
  }

  return { high, low, volume, tradeCount: trades.length };
}

/**
 * Get full market stats for a product.
 */
export async function getMarketStats(productId: string): Promise<MarketStats> {
  const [lastPrice, stats, spreadData] = await Promise.all([
    getLastTradePrice(productId),
    get24hStats(productId),
    getSpread(productId),
  ]);

  return {
    lastPrice,
    high24h: stats.high,
    low24h: stats.low,
    volume24h: stats.volume,
    spread: spreadData,
  };
}

/**
 * Get the current spread for a product.
 */
export async function getSpread(productId: string): Promise<Decimal> {
  const [bestBid, bestAsk] = await Promise.all([
    prisma.order.findFirst({
      where: {
        productId,
        side: "BUY",
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      orderBy: { pricePerUnit: "desc" },
      select: { pricePerUnit: true },
    }),
    prisma.order.findFirst({
      where: {
        productId,
        side: "SELL",
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      orderBy: { pricePerUnit: "asc" },
      select: { pricePerUnit: true },
    }),
  ]);

  if (!bestBid || !bestAsk) {
    return new Decimal(0);
  }

  return bestAsk.pricePerUnit.minus(bestBid.pricePerUnit);
}

/**
 * Calculate the VWAP (Volume Weighted Average Price) for a product.
 */
export async function getVwap(
  productId: string,
  since?: Date
): Promise<Decimal | null> {
  const sinceDate = since ?? new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trades = await prisma.trade.findMany({
    where: {
      productId,
      createdAt: { gte: sinceDate },
    },
    select: {
      pricePerUnit: true,
      quantity: true,
      totalValue: true,
    },
  });

  if (trades.length === 0) return null;

  let totalValue = new Decimal(0);
  let totalQuantity = new Decimal(0);

  for (const trade of trades) {
    totalValue = totalValue.plus(trade.totalValue);
    totalQuantity = totalQuantity.plus(trade.quantity);
  }

  if (totalQuantity.isZero()) return null;
  return totalValue.dividedBy(totalQuantity);
}

/**
 * Get recent trade history for a product.
 */
export async function getRecentTrades(
  productId: string,
  limit = 50
): Promise<
  Array<{
    price: Decimal;
    quantity: Decimal;
    totalValue: Decimal;
    side: "BUY" | "SELL";
    createdAt: Date;
  }>
> {
  const trades = await prisma.trade.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      pricePerUnit: true,
      quantity: true,
      totalValue: true,
      createdAt: true,
    },
  });

  return trades.map((t) => ({
    price: t.pricePerUnit,
    quantity: t.quantity,
    totalValue: t.totalValue,
    side: "BUY" as const, // Determined by order context
    createdAt: t.createdAt,
  }));
}

/**
 * Get the mid-market price (average of best bid and best ask).
 */
export async function getMidPrice(productId: string): Promise<Decimal | null> {
  const [bestBid, bestAsk] = await Promise.all([
    prisma.order.findFirst({
      where: {
        productId,
        side: "BUY",
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      orderBy: { pricePerUnit: "desc" },
      select: { pricePerUnit: true },
    }),
    prisma.order.findFirst({
      where: {
        productId,
        side: "SELL",
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      orderBy: { pricePerUnit: "asc" },
      select: { pricePerUnit: true },
    }),
  ]);

  if (!bestBid || !bestAsk) return null;
  return bestBid.pricePerUnit.plus(bestAsk.pricePerUnit).dividedBy(2);
}
