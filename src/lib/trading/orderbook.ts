import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import { ORDER_BOOK_DEPTH } from "@/lib/constants";
import type { OrderBookSnapshot, OrderBookLevel, PriceLevel } from "@/types/trading";

/**
 * Order book management for a specific product.
 * Maintains sorted bid/ask levels and provides snapshot functionality.
 */
export class OrderBook {
  readonly productId: string;

  constructor(productId: string) {
    this.productId = productId;
  }

  /**
   * Get a full snapshot of the order book.
   */
  async getSnapshot(depth = ORDER_BOOK_DEPTH): Promise<OrderBookSnapshot> {
    const [bids, asks] = await Promise.all([
      this.getLevels("BUY", depth),
      this.getLevels("SELL", depth),
    ]);

    return {
      productId: this.productId,
      bids,
      asks,
      timestamp: new Date(),
    };
  }

  /**
   * Get aggregated price levels for one side of the book.
   */
  async getLevels(
    side: "BUY" | "SELL",
    depth = ORDER_BOOK_DEPTH
  ): Promise<OrderBookLevel[]> {
    const orderBy =
      side === "BUY"
        ? { pricePerUnit: "desc" as const }
        : { pricePerUnit: "asc" as const };

    const orders = await prisma.order.findMany({
      where: {
        productId: this.productId,
        side,
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      select: {
        pricePerUnit: true,
        quantity: true,
        filledQuantity: true,
      },
      orderBy,
      take: depth * 5, // Fetch extra to account for aggregation
    });

    // Aggregate by price level
    const levelMap = new Map<string, { price: Decimal; quantity: Decimal; orderCount: number }>();

    for (const order of orders) {
      const available = order.quantity.minus(order.filledQuantity);
      if (available.lte(0)) continue;

      const priceKey = order.pricePerUnit.toString();
      const existing = levelMap.get(priceKey);

      if (existing) {
        existing.quantity = existing.quantity.plus(available);
        existing.orderCount += 1;
      } else {
        levelMap.set(priceKey, {
          price: order.pricePerUnit,
          quantity: available,
          orderCount: 1,
        });
      }
    }

    // Sort and take top N levels
    const levels = Array.from(levelMap.values())
      .sort((a, b) => {
        const cmp = a.price.minus(b.price).toNumber();
        return side === "BUY" ? -cmp : cmp;
      })
      .slice(0, depth);

    // Calculate running total
    let runningTotal = new Decimal(0);
    return levels.map((level) => {
      runningTotal = runningTotal.plus(level.quantity);
      return {
        price: level.price,
        quantity: level.quantity,
        total: runningTotal,
      };
    });
  }

  /**
   * Get the spread between best bid and best ask.
   */
  async getSpread(): Promise<{
    bestBid: Decimal | null;
    bestAsk: Decimal | null;
    spread: Decimal | null;
    spreadPercent: Decimal | null;
  }> {
    const [bestBidOrder, bestAskOrder] = await Promise.all([
      prisma.order.findFirst({
        where: {
          productId: this.productId,
          side: "BUY",
          status: { in: ["OPEN", "PARTIALLY_FILLED"] },
        },
        orderBy: { pricePerUnit: "desc" },
        select: { pricePerUnit: true },
      }),
      prisma.order.findFirst({
        where: {
          productId: this.productId,
          side: "SELL",
          status: { in: ["OPEN", "PARTIALLY_FILLED"] },
        },
        orderBy: { pricePerUnit: "asc" },
        select: { pricePerUnit: true },
      }),
    ]);

    const bestBid = bestBidOrder?.pricePerUnit ?? null;
    const bestAsk = bestAskOrder?.pricePerUnit ?? null;

    if (!bestBid || !bestAsk) {
      return { bestBid, bestAsk, spread: null, spreadPercent: null };
    }

    const spread = bestAsk.minus(bestBid);
    const midPrice = bestBid.plus(bestAsk).dividedBy(2);
    const spreadPercent = midPrice.gt(0) ? spread.dividedBy(midPrice).times(100) : new Decimal(0);

    return { bestBid, bestAsk, spread, spreadPercent };
  }

  /**
   * Get the total volume at each price level (for depth chart).
   */
  async getDepthChart(): Promise<{ bids: PriceLevel[]; asks: PriceLevel[] }> {
    const [bidLevels, askLevels] = await Promise.all([
      this.getLevels("BUY", 100),
      this.getLevels("SELL", 100),
    ]);

    return {
      bids: bidLevels.map((l) => ({
        price: l.price,
        volume: l.total,
        orderCount: 0,
      })),
      asks: askLevels.map((l) => ({
        price: l.price,
        volume: l.total,
        orderCount: 0,
      })),
    };
  }

  /**
   * Get open order count for a product.
   */
  async getOrderCount(): Promise<{ buyCount: number; sellCount: number }> {
    const [buyCount, sellCount] = await Promise.all([
      prisma.order.count({
        where: {
          productId: this.productId,
          side: "BUY",
          status: { in: ["OPEN", "PARTIALLY_FILLED"] },
        },
      }),
      prisma.order.count({
        where: {
          productId: this.productId,
          side: "SELL",
          status: { in: ["OPEN", "PARTIALLY_FILLED"] },
        },
      }),
    ]);

    return { buyCount, sellCount };
  }
}
