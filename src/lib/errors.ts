/**
 * Custom error classes for the AI Credits Trading Platform.
 * Each error maps to a specific HTTP status code for consistent API responses.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

export class KycRequiredError extends AppError {
  constructor(message = "KYC verification is required to perform this action") {
    super(message, 403, "KYC_REQUIRED");
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(message = "Insufficient balance") {
    super(message, 400, "INSUFFICIENT_BALANCE");
  }
}

export class AccountSuspendedError extends AppError {
  constructor(message = "Your account has been suspended") {
    super(message, 403, "ACCOUNT_SUSPENDED");
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfter: number;

  constructor(retryAfter: number, message = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super("Validation failed", 422, "VALIDATION_ERROR");
    this.details = details;
  }

  public toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

export class OrderExpiredError extends AppError {
  constructor(message = "Order has expired") {
    super(message, 400, "ORDER_EXPIRED");
  }
}

export class AuctionEndedError extends AppError {
  constructor(message = "Auction has ended") {
    super(message, 400, "AUCTION_ENDED");
  }
}

export class WalletFrozenError extends AppError {
  constructor(message = "Wallet operations are frozen") {
    super(message, 400, "WALLET_FROZEN");
  }
}

/**
 * Type guard for AppError instances.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
