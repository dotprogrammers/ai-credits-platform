import { z } from "zod";

/**
 * Schema for admin user management actions.
 */
export const adminUpdateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["USER", "AFFILIATE", "ADMIN", "SUPER_ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED", "PENDING_VERIFICATION", "CLOSED"]).optional(),
  name: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;

/**
 * Schema for KYC review actions.
 */
export const kycReviewSchema = z.object({
  kycId: z.string().min(1, "KYC record ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectionReason: z.string().optional(),
});

export type KycReviewInput = z.infer<typeof kycReviewSchema>;

/**
 * Schema for updating platform settings.
 */
export const updatePlatformSettingSchema = z.object({
  key: z.string().min(1, "Setting key is required"),
  value: z.unknown(),
  description: z.string().max(500).optional(),
  category: z.string().default("general"),
});

export type UpdatePlatformSettingInput = z.infer<typeof updatePlatformSettingSchema>;

/**
 * Schema for updating commission configuration.
 */
export const updateCommissionConfigSchema = z.object({
  tradeCommission: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v >= 0 && v <= 1, "Commission rate must be between 0 and 1")
    .optional(),
  auctionFee: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v >= 0, "Auction fee must be non-negative")
    .optional(),
  minCommission: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .optional(),
  maxCommission: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .optional(),
  affiliateRate: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v >= 0 && v <= 1, "Affiliate rate must be between 0 and 1")
    .optional(),
});

export type UpdateCommissionConfigInput = z.infer<typeof updateCommissionConfigSchema>;

/**
 * Schema for admin audit log query.
 */
export const auditLogFilterSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type AuditLogFilterInput = z.infer<typeof auditLogFilterSchema>;

/**
 * Schema for wallet adjustment by admin.
 */
export const walletAdjustmentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amountUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v !== 0, "Amount cannot be zero"),
  reason: z.string().min(1, "Reason is required").max(500),
});

export type WalletAdjustmentInput = z.infer<typeof walletAdjustmentSchema>;

/**
 * Schema for managing providers.
 */
export const manageProviderSchema = z.object({
  type: z.enum(["OPENAI", "ANTHROPIC", "GOOGLE", "MISTRAL", "META", "COHERE", "CUSTOM"]).optional(),
  name: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(100).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(1000).optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type ManageProviderInput = z.infer<typeof manageProviderSchema>;

/**
 * Schema for managing credit products.
 */
export const manageProductSchema = z.object({
  providerId: z.string().optional(),
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  faceValueUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0)
    .optional(),
  sellPriceUsd: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0)
    .optional(),
  creditUnit: z.string().max(50).optional(),
  creditAmount: z
    .string()
    .or(z.number())
    .transform((v) => Number(v))
    .refine((v) => v > 0)
    .optional(),
  isActive: z.boolean().optional(),
});

export type ManageProductInput = z.infer<typeof manageProductSchema>;
