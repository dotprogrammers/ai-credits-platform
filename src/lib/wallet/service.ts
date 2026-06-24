import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { Ledger } from "./ledger";
import {
  BadRequestError,
  InsufficientBalanceError,
  NotFoundError,
} from "@/lib/errors";
import type { TransactionType, TransactionStatus } from "@prisma/client";

/**
 * Wallet operations service.
 * Provides credit, debit, freeze, and balance query operations.
 */
export class WalletService {
  private ledger = new Ledger();

  /**
   * Get a user's wallet.
   */
  async getWallet(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new NotFoundError("Wallet");
    }
    return wallet;
  }

  /**
   * Get available (unfrozen) balance.
   */
  async getAvailableBalance(userId: string): Promise<{
    availableUsd: Decimal;
    availableCredits: Decimal;
  }> {
    const wallet = await this.getWallet(userId);
    return {
      availableUsd: wallet.balanceUsd.minus(wallet.frozenUsd),
      availableCredits: wallet.balanceCredits.minus(wallet.frozenCredits),
    };
  }

  /**
   * Credit a user's wallet (add funds).
   */
  async credit(params: {
    userId: string;
    amountUsd: Decimal;
    amountCredits?: Decimal;
    type: TransactionType;
    referenceId?: string;
    referenceType?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    const {
      userId,
      amountUsd,
      amountCredits = new Decimal(0),
      type,
      referenceId,
      referenceType,
      description,
      metadata,
    } = params;

    if (amountUsd.lt(0) || amountCredits.lt(0)) {
      throw new BadRequestError("Amounts cannot be negative");
    }

    // Use a transaction to ensure atomicity
    const [wallet, transaction] = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({
        where: { userId },
      });

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balanceUsd: wallet.balanceUsd.plus(amountUsd),
          balanceCredits: wallet.balanceCredits.plus(amountCredits),
          ...(type === "DEPOSIT"
            ? { totalDeposited: wallet.totalDeposited.plus(amountUsd) }
            : {}),
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type,
          status: "COMPLETED",
          amountUsd,
          amountCredits,
          referenceId,
          referenceType,
          description,
          metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
          completedAt: new Date(),
        },
      });

      return [updatedWallet, transaction] as const;
    });

    // Record in double-entry ledger
    await this.ledger.recordEntry({
      walletId: wallet.id,
      transactionId: transaction.id,
      type,
      debit: amountUsd,
      description,
    });

    return { wallet, transaction };
  }

  /**
   * Debit a user's wallet (remove funds).
   */
  async debit(params: {
    userId: string;
    amountUsd: Decimal;
    amountCredits?: Decimal;
    type: TransactionType;
    referenceId?: string;
    referenceType?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    const {
      userId,
      amountUsd,
      amountCredits = new Decimal(0),
      type,
      referenceId,
      referenceType,
      description,
      metadata,
    } = params;

    if (amountUsd.lt(0) || amountCredits.lt(0)) {
      throw new BadRequestError("Amounts cannot be negative");
    }

    const [wallet, transaction] = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({
        where: { userId },
      });

      const availableUsd = wallet.balanceUsd.minus(wallet.frozenUsd);
      const availableCredits = wallet.balanceCredits.minus(wallet.frozenCredits);

      if (availableUsd.lt(amountUsd)) {
        throw new InsufficientBalanceError(
          `Insufficient USD balance. Available: $${availableUsd.toFixed(2)}`
        );
      }

      if (availableCredits.lt(amountCredits)) {
        throw new InsufficientBalanceError(
          `Insufficient credits balance. Available: ${availableCredits.toFixed(4)}`
        );
      }

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balanceUsd: wallet.balanceUsd.minus(amountUsd),
          balanceCredits: wallet.balanceCredits.minus(amountCredits),
          ...(type === "WITHDRAWAL"
            ? { totalWithdrawn: wallet.totalWithdrawn.plus(amountUsd) }
            : {}),
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type,
          status: "COMPLETED",
          amountUsd,
          amountCredits,
          referenceId,
          referenceType,
          description,
          metadata: (metadata as Prisma.InputJsonValue) ?? undefined,
          completedAt: new Date(),
        },
      });

      return [updatedWallet, transaction] as const;
    });

    // Record in double-entry ledger
    await this.ledger.recordEntry({
      walletId: wallet.id,
      transactionId: transaction.id,
      type,
      credit: amountUsd,
      description,
    });

    return { wallet, transaction };
  }

  /**
   * Freeze funds in a user's wallet (e.g., for an open order).
   */
  async freeze(params: {
    userId: string;
    amountUsd?: Decimal;
    amountCredits?: Decimal;
    referenceId?: string;
    description?: string;
  }) {
    const { userId, amountUsd = new Decimal(0), amountCredits = new Decimal(0), referenceId, description } = params;

    const [wallet, transaction] = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({
        where: { userId },
      });

      const availableUsd = wallet.balanceUsd.minus(wallet.frozenUsd);
      const availableCredits = wallet.balanceCredits.minus(wallet.frozenCredits);

      if (availableUsd.lt(amountUsd)) {
        throw new InsufficientBalanceError("Insufficient USD balance to freeze");
      }
      if (availableCredits.lt(amountCredits)) {
        throw new InsufficientBalanceError("Insufficient credits balance to freeze");
      }

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          frozenUsd: wallet.frozenUsd.plus(amountUsd),
          frozenCredits: wallet.frozenCredits.plus(amountCredits),
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "ADJUSTMENT",
          status: "COMPLETED",
          amountUsd,
          amountCredits,
          referenceId,
          description: description ?? "Funds frozen for order",
          metadata: { action: "freeze" },
          completedAt: new Date(),
        },
      });

      return [updatedWallet, transaction] as const;
    });

    return { wallet, transaction };
  }

  /**
   * Unfreeze funds in a user's wallet (e.g., when an order is cancelled).
   */
  async unfreeze(params: {
    userId: string;
    amountUsd?: Decimal;
    amountCredits?: Decimal;
    referenceId?: string;
    description?: string;
  }) {
    const { userId, amountUsd = new Decimal(0), amountCredits = new Decimal(0), referenceId, description } = params;

    const wallet = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUniqueOrThrow({
        where: { userId },
      });

      return tx.wallet.update({
        where: { userId },
        data: {
          frozenUsd: Decimal.max(wallet.frozenUsd.minus(amountUsd), 0),
          frozenCredits: Decimal.max(wallet.frozenCredits.minus(amountCredits), 0),
        },
      });
    });

    return wallet;
  }

  /**
   * Get transaction history for a wallet.
   */
  async getTransactions(params: {
    userId: string;
    type?: TransactionType;
    status?: TransactionStatus;
    page?: number;
    limit?: number;
  }) {
    const { userId, type, status, page = 1, limit = 20 } = params;

    const wallet = await this.getWallet(userId);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          walletId: wallet.id,
          ...(type ? { type } : {}),
          ...(status ? { status } : {}),
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: {
          walletId: wallet.id,
          ...(type ? { type } : {}),
          ...(status ? { status } : {}),
        },
      }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const walletService = new WalletService();
