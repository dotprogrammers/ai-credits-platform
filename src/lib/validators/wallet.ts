import { z } from "zod";
import {
  MIN_DEPOSIT_USD,
  MAX_DEPOSIT_USD,
  MIN_WITHDRAWAL_USD,
  MAX_WITHDRAWAL_USD,
} from "@/lib/constants";

/**
 * Schema for depositing funds into wallet.
 */
export const depositSchema = z.object({
  amountUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v >= MIN_DEPOSIT_USD, `Minimum deposit is $${MIN_DEPOSIT_USD}`)
    .refine((v) => v <= MAX_DEPOSIT_USD, `Maximum deposit is $${MAX_DEPOSIT_USD.toLocaleString()}`),
  method: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "CRYPTO", "PLATFORM_CREDIT"]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;

/**
 * Schema for withdrawing funds from wallet.
 */
export const withdrawalSchema = z.object({
  amountUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v >= MIN_WITHDRAWAL_USD, `Minimum withdrawal is $${MIN_WITHDRAWAL_USD}`)
    .refine(
      (v) => v <= MAX_WITHDRAWAL_USD,
      `Maximum withdrawal is $${MAX_WITHDRAWAL_USD.toLocaleString()}`
    ),
  method: z.enum(["BANK_TRANSFER", "CRYPTO", "PLATFORM_CREDIT"]),
  destination: z
    .string()
    .min(1, "Destination address is required")
    .max(500, "Destination is too long"),
  network: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type WithdrawalInput = z.infer<typeof withdrawalSchema>;

/**
 * Schema for wallet transfer between users.
 */
export const transferSchema = z.object({
  toUserId: z.string().min(1, "Recipient user ID is required"),
  amountUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0, "Amount must be greater than 0"),
  note: z.string().max(500).optional(),
});

export type TransferInput = z.infer<typeof transferSchema>;

/**
 * Schema for wallet transaction query filters.
 */
export const transactionFilterSchema = z.object({
  type: z
    .enum([
      "DEPOSIT",
      "WITHDRAWAL",
      "TRADE_BUY",
      "TRADE_SELL",
      "COMMISSION",
      "AUCTION_FEE",
      "AFFILIATE_COMMISSION",
      "AFFILIATE_PAYOUT",
      "PLATFORM_FEE",
      "ADJUSTMENT",
    ])
    .optional(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REVERSED"]).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
