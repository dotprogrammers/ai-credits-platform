import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import { OrderBook } from "./orderbook";
import { calculateFee } from "./fees";
import { BadRequestError, InsufficientBalanceError } from "@/lib/errors";
import type { TradeExecution } from "@/types/trading";

/**
 * Order matching engine with price-time priority.
 * Matches incoming orders against the order book and produces trade executions.
 */
export class MatchingEngine {
  private orderBooks: Map<string, OrderBook> = new Map();

  /**
   * Get or create an order book for a product.
   */
  private getOrderBook(productId: string): OrderBook {
    let book = this.orderBooks.get(productId);
    if (!book) {
      book = new OrderBook(productId);
      this.orderBooks.set(productId, book);
    }
    return book;
  }

  /**
   * Process a new incoming order. Attempts to match against existing orders.
   * Returns the list of trade executions that resulted from matching.
   */
  async processOrder(params: {
    orderId: string;
    productId: string;
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    pricePerUnit: Decimal;
    quantity: Decimal;
    userId: string;
  }): Promise<TradeExecution[]> {
    const { orderId, productId, side, type, pricePerUnit, quantity, userId } = params;
    const book = this.getOrderBook(productId);
    const executions: TradeExecution[] = [];

    // Load existing orders from the book for the opposite side
    const oppositeSide = side === "BUY" ? "SELL" : "BUY";
    const oppositeOrders = await this.loadOppositeOrders(productId, oppositeSide);

    let remainingQty = new Decimal(quantity);

    for (const existingOrder of oppositeOrders) {
      if (remainingQty.lte(0)) break;

      // Price compatibility check
      if (type === "LIMIT") {
        if (side === "BUY" && existingOrder.pricePerUnit.gt(pricePerUnit)) break;
        if (side === "SELL" && existingOrder.pricePerUnit.lt(pricePerUnit)) break;
      }

      // Don't match with own orders
      if (existingOrder.userId === userId) continue;

      const availableQty = existingOrder.quantity.minus(existingOrder.filledQuantity);
      if (availableQty.lte(0)) continue;

      const fillQty = Decimal.min(remainingQty, availableQty);
      const fillPrice = existingOrder.pricePerUnit;
      const fillValue = fillPrice.times(fillQty);

      // Calculate fees
      const buyerFee = calculateFee(fillValue.toNumber(), "trade");
      const sellerFee = calculateFee(fillValue.toNumber(), "trade");

      const execution: TradeExecution = {
        buyOrderId: side === "BUY" ? orderId : existingOrder.id,
        sellOrderId: side === "SELL" ? orderId : existingOrder.id,
        price: fillPrice,
        quantity: fillQty,
        value: fillValue,
        buyerFee: new Decimal(buyerFee.toFixed(4)),
        sellerFee: new Decimal(sellerFee.toFixed(4)),
      };

      executions.push(execution);
      remainingQty = remainingQty.minus(fillQty);

      // Update the existing order's filled quantity
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          filledQuantity: existingOrder.filledQuantity.plus(fillQty),
          filledValue: existingOrder.filledValue.plus(fillValue),
          status: existingOrder.filledQuantity.plus(fillQty).gte(existingOrder.quantity)
            ? "FILLED"
            : "PARTIALLY_FILLED",
        },
      });

      // Create order fill record
      await prisma.orderFill.create({
        data: {
          orderId: existingOrder.id,
          buyOrderId: execution.buyOrderId,
          sellOrderId: execution.sellOrderId,
          price: fillPrice,
          quantity: fillQty,
          value: fillValue,
          feeUsd: side === "BUY" ? execution.buyerFee : execution.sellerFee,
        },
      });
    }

    // If there is remaining quantity for a LIMIT order, add to the book
    if (remainingQty.gt(0) && type === "LIMIT") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          filledQuantity: quantity.minus(remainingQty),
          filledValue: pricePerUnit.times(quantity.minus(remainingQty)),
        },
      });
    }

    // For MARKET orders with remaining quantity, mark as expired (no more liquidity)
    if (remainingQty.gt(0) && type === "MARKET") {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "FILLED",
          filledQuantity: quantity.minus(remainingQty),
        },
      });
    }

    return executions;
  }

  /**
   * Load opposite-side orders from the database, sorted by price-time priority.
   */
  private async loadOppositeOrders(
    productId: string,
    side: "BUY" | "SELL"
  ) {
    const orderBy =
      side === "SELL"
        ? [{ pricePerUnit: "asc" as const }, { createdAt: "asc" as const }]
        : [{ pricePerUnit: "desc" as const }, { createdAt: "asc" as const }];

    return prisma.order.findMany({
      where: {
        productId,
        side,
        status: { in: ["OPEN", "PARTIALLY_FILLED"] },
      },
      orderBy,
      take: 100,
    });
  }

  /**
   * Cancel an order and remove it from the matching engine.
   */
  async cancelOrder(orderId: string, userId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestError("Order not found");
    }

    if (order.userId !== userId) {
      throw new BadRequestError("You do not own this order");
    }

    if (order.status !== "OPEN" && order.status !== "PARTIALLY_FILLED") {
      throw new BadRequestError("Order cannot be cancelled in its current state");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });
  }

  /**
   * Get the current best bid and ask for a product.
   */
  async getBestPrices(productId: string): Promise<{
    bestBid: Decimal | null;
    bestAsk: Decimal | null;
  }> {
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

    return {
      bestBid: bestBid?.pricePerUnit ?? null,
      bestAsk: bestAsk?.pricePerUnit ?? null,
    };
  }
}

// Singleton instance
export const matchingEngine = new MatchingEngine();
