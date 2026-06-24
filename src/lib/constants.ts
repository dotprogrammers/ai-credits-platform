/**
 * Application-wide constants for the AI Credits Trading Platform.
 */

// ─── Platform ────────────────────────────────────────────
export const APP_NAME = "AI Credits Platform";
export const APP_DESCRIPTION = "Trade AI API credits on a decentralized marketplace";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Pagination ──────────────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

// ─── Auth ────────────────────────────────────────────────
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
export const JWT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const REFERRAL_CODE_LENGTH = 8;

// ─── Wallet ──────────────────────────────────────────────
export const MIN_DEPOSIT_USD = 10;
export const MAX_DEPOSIT_USD = 100_000;
export const MIN_WITHDRAWAL_USD = 20;
export const MAX_WITHDRAWAL_USD = 50_000;
export const WALLET_PRECISION = {
  USD: 2,
  CREDITS: 4,
} as const;

// ─── Trading ─────────────────────────────────────────────
export const MIN_ORDER_VALUE_USD = 1;
export const MAX_ORDER_VALUE_USD = 1_000_000;
export const DEFAULT_ORDER_EXPIRY_HOURS = 72;
export const ORDER_BOOK_DEPTH = 50;
export const PRICE_PRECISION = 6;
export const QUANTITY_PRECISION = 4;

// ─── Auctions ────────────────────────────────────────────
export const MIN_AUCTION_DURATION_HOURS = 1;
export const MAX_AUCTION_DURATION_HOURS = 168; // 7 days
export const AUCTION_EXTENSION_MINUTES = 5;
export const MIN_BID_INCREMENT_PERCENT = 1;

// ─── Fees ────────────────────────────────────────────────
export const DEFAULT_TRADE_COMMISSION = 0.0025; // 0.25%
export const DEFAULT_AUCTION_FEE_USD = 1.0;
export const DEFAULT_AFFILIATE_RATE = 0.02; // 2%
export const MIN_COMMISSION_USD = 0.01;
export const MAX_COMMISSION_USD = 100.0;

// ─── Affiliate ───────────────────────────────────────────
export const AFFILIATE_TIERS = {
  standard: { rate: 0.02, label: "Standard" },
  silver: { rate: 0.03, label: "Silver" },
  gold: { rate: 0.04, label: "Gold" },
  platinum: { rate: 0.05, label: "Platinum" },
} as const;

export const AFFILIATE_MIN_PAYOUT_USD = 50;
export const AFFILIATE_TIER_THRESHOLDS = {
  standard: 0,
  silver: 10,
  gold: 50,
  platinum: 200,
} as const;

// ─── Rate Limiting ───────────────────────────────────────
export const RATE_LIMITS = {
  general: { windowMs: 60_000, max: 100 },
  auth: { windowMs: 15 * 60_000, max: 10 },
  api: { windowMs: 60_000, max: 60 },
  trading: { windowMs: 1_000, max: 10 },
} as const;

// ─── Notifications ───────────────────────────────────────
export const SSE_HEARTBEAT_INTERVAL_MS = 30_000;
export const SSE_RECONNECT_INTERVAL_MS = 3_000;
export const NOTIFICATION_BATCH_SIZE = 50;

// ─── KYC ─────────────────────────────────────────────────
export const KYC_DOCUMENT_TYPES = [
  "passport",
  "drivers_license",
  "national_id",
  "residence_permit",
] as const;

// ─── Providers ───────────────────────────────────────────
export const SUPPORTED_PROVIDERS = [
  "OPENAI",
  "ANTHROPIC",
  "GOOGLE",
  "MISTRAL",
  "META",
  "COHERE",
  "CUSTOM",
] as const;
