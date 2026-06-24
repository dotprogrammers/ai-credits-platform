import { RATE_LIMITS } from "@/lib/constants";
import { RateLimitError } from "@/lib/errors";

/**
 * In-memory rate limiter using a sliding window approach.
 * For production, consider using Redis-backed rate limiting.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

type RateLimitTier = keyof typeof RATE_LIMITS;

/**
 * Check if a request should be rate limited.
 * Throws RateLimitError if the limit is exceeded.
 */
export function checkRateLimit(
  key: string,
  tier: RateLimitTier = "general"
): { remaining: number; resetAt: Date } {
  const config = RATE_LIMITS[tier];
  const now = Date.now();
  const windowStart = now - config.windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= config.max) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + config.windowMs - now) / 1000);
    throw new RateLimitError(retryAfter);
  }

  entry.timestamps.push(now);

  const remaining = config.max - entry.timestamps.length;
  const resetAt = new Date(entry.timestamps[0] + config.windowMs);

  return { remaining, resetAt };
}

/**
 * Create a rate limit key from a request.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  return `${prefix}:${ip}`;
}

/**
 * Rate limit middleware for API routes.
 * Returns headers to include in the response.
 */
export function rateLimitMiddleware(
  request: Request,
  tier: RateLimitTier = "general"
): { remaining: number; resetAt: Date; headers: Record<string, string> } {
  const key = getRateLimitKey(request, `rl:${tier}`);
  const result = checkRateLimit(key, tier);

  return {
    ...result,
    headers: {
      "X-RateLimit-Limit": String(RATE_LIMITS[tier].max),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": result.resetAt.toISOString(),
    },
  };
}

/**
 * Clean up expired entries from the rate limit store.
 * Should be called periodically.
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter(
      (t) => t > now - 15 * 60 * 1000 // Keep entries for 15 minutes
    );
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

// Periodic cleanup every 5 minutes
if (typeof globalThis !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000).unref?.();
}
