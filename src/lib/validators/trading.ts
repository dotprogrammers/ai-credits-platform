import { z } from "zod";
import {
  MIN_ORDER_VALUE_USD,
  MAX_ORDER_VALUE_USD,
  PRICE_PRECISION,
  QUANTITY_PRECISION,
  DEFAULT_ORDER_EXPIRY_HOURS,
} from "@/lib/constants";

/**
 * Schema for placing a limit order.
 */
export const limitOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  side: z.enum(["BUY", "SELL"]),
  pricePerUnit: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Price must be greater than 0"),
  quantity: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Quantity must be greater than 0"),
  expiresAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
});

export type LimitOrderInput = z.infer<typeof limitOrderSchema>;

/**
 * Schema for placing a market order.
 */
export const marketOrderSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  side: z.enum(["BUY", "SELL"]),
  quantity: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Quantity must be greater than 0"),
});

export type MarketOrderInput = z.infer<typeof marketOrderSchema>;

/**
 * Combined order schema (auto-detects limit vs market).
 */
export const createOrderSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("LIMIT"),
    ...limitOrderSchema.shape,
  }),
  z.object({
    type: z.literal("MARKET"),
    ...marketOrderSchema.shape,
  }),
]);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Schema for cancelling an order.
 */
export const cancelOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

/**
 * Schema for order query filters.
 */
export const orderFilterSchema = z.object({
  productId: z.string().optional(),
  side: z.enum(["BUY", "SELL"]).optional(),
  status: z.enum(["OPEN", "PARTIALLY_FILLED", "FILLED", "CANCELLED", "EXPIRED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type OrderFilterInput = z.infer<typeof orderFilterSchema>;

/**
 * Schema for placing an auction bid.
 */
export const auctionBidSchema = z.object({
  auctionId: z.string().min(1, "Auction ID is required"),
  amount: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Bid amount must be greater than 0"),
  quantity: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Quantity must be greater than 0"),
});

export type AuctionBidInput = z.infer<typeof auctionBidSchema>;

/**
 * Schema for creating an auction.
 */
export const createAuctionSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Quantity must be greater than 0"),
  startPrice: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Start price must be greater than 0"),
  reservePrice: z
    .string()
    .or(z.number())
    .optional()
    .transform((v) => (v !== undefined ? Number(v) : undefined)),
  startsAt: z.coerce.date().refine((d) => d > new Date(), "Start time must be in the future"),
  endsAt: z.coerce.date(),
}).refine((data) => data.endsAt > data.startsAt, {
  message: "End time must be after start time",
  path: ["endsAt"],
});

export type CreateAuctionInput = z.infer<typeof createAuctionSchema>;
