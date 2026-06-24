import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  referralCode: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string(),
});

export const twoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
  token: z.string(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  image: z.string().url().optional(),
});

export const kycSubmitSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().datetime(),
  documentType: z.string(),
  documentNumber: z.string(),
  documentFront: z.string().url(),
  documentBack: z.string().url().optional(),
  selfieUrl: z.string().url(),
});

export const kycReviewSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export const depositSchema = z.object({
  amountUsd: z.number().positive(),
  method: z.enum(['CREDIT_CARD', 'BANK_TRANSFER', 'CRYPTO', 'PLATFORM_CREDIT']),
  externalRef: z.string().optional(),
});

export const withdrawSchema = z.object({
  amountUsd: z.number().positive(),
  method: z.enum(['BANK_TRANSFER', 'CRYPTO', 'PLATFORM_CREDIT']),
  destination: z.string(),
  network: z.string().optional(),
});

export const createOrderSchema = z.object({
  productId: z.string(),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['LIMIT', 'MARKET']),
  pricePerUnit: z.number().positive(),
  quantity: z.number().positive(),
});

export const createAuctionSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  startPrice: z.number().positive(),
  reservePrice: z.number().positive().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export const placeBidSchema = z.object({
  amount: z.number().positive(),
  quantity: z.number().positive(),
});

export const instantTradeSchema = z.object({
  productId: z.string(),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive(),
});

export const createBlogPostSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  excerpt: z.string().optional(),
  content: z.string(),
  coverImage: z.string().url().optional(),
  categoryId: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  tags: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const createProviderSchema = z.object({
  type: z.enum(['OPENAI', 'ANTHROPIC', 'GOOGLE', 'MISTRAL', 'META', 'COHERE', 'CUSTOM']),
  name: z.string(),
  displayName: z.string(),
  logoUrl: z.string().url().optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const updateSettingsSchema = z.record(z.string(), z.unknown());

export const updateCommissionSchema = z.object({
  tradeCommission: z.number().min(0).max(1).optional(),
  auctionFee: z.number().min(0).optional(),
  minCommission: z.number().min(0).optional(),
  maxCommission: z.number().min(0).optional(),
  affiliateRate: z.number().min(0).max(1).optional(),
});

export const updateLandingSchema = z.object({
  sectionKey: z.string(),
  title: z.string().optional(),
  content: z.unknown().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
