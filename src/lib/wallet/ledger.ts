import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/db/prisma";
import type { TransactionType } from "@prisma/client";

/**
 * Double-entry ledger logic.
 * Every transaction has two entries: a debit and a credit.
 * The sum of all debits must equal the sum of all credits.
 */
export class Ledger {
  /**
   * Record a single ledger entry for a wallet transaction.
   * In a full double-entry system, this would create both sides.
   * Here we record the wallet-side entry; the counterparty is recorded separately.
   */
  async recordEntry(params: {
    walletId: string;
    transactionId: string;
    type: TransactionType;
    debit?: Decimal;
    credit?: Decimal;
    description?: string;
  }) {
    const { walletId, transactionId, type, debit, credit, description } = params;

    // Validate that exactly one of debit/credit is provided
    if ((!debit && !credit) || (debit && credit)) {
      throw new Error("Exactly one of debit or credit must be provided");
    }

    const amount = debit ?? credit ?? new Decimal(0);
    const entryType = debit ? "DEBIT" : "CREDIT";

    // Store the ledger entry as metadata on the transaction
    // In a production system, this would be a separate ledger_entries table
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        metadata: {
          ledgerEntry: {
            walletId,
            type: entryType,
            amount: amount.toString(),
            transactionType: type,
            description,
            timestamp: new Date().toISOString(),
          },
        },
      },
    });

    return {
      transactionId,
      walletId,
      entryType,
      amount,
      transactionType: type,
    };
  }

  /**
   * Record a transfer between two wallets (double-entry).
   */
  async recordTransfer(params: {
    fromWalletId: string;
    toWalletId: string;
    amountUsd: Decimal;
    type: TransactionType;
    transactionId: string;
    description?: string;
  }) {
    const { fromWalletId, toWalletId, amountUsd, type, transactionId, description } = params;

    // Debit from source wallet
    await this.recordEntry({
      walletId: fromWalletId,
      transactionId,
      type,
      credit: amountUsd, // Credit reduces balance
      description: description ?? "Transfer out",
    });

    // Credit to destination wallet
    await this.recordEntry({
      walletId: toWalletId,
      transactionId,
      type,
      debit: amountUsd, // Debit increases balance
      description: description ?? "Transfer in",
    });

    return { transactionId, amountUsd, type };
  }

  /**
   * Verify the ledger is balanced for a given wallet.
   * Returns the difference between total debits and credits.
   * A balanced ledger should have a difference of 0.
   */
  async verifyBalance(walletId: string): Promise<{
    totalDebits: Decimal;
    totalCredits: Decimal;
    difference: Decimal;
    isBalanced: boolean;
  }> {
    const transactions = await prisma.transaction.findMany({
      where: { walletId, status: "COMPLETED" },
      select: {
        amountUsd: true,
        metadata: true,
      },
    });

    let totalDebits = new Decimal(0);
    let totalCredits = new Decimal(0);

    for (const tx of transactions) {
      const meta = tx.metadata as { ledgerEntry?: { type: string; amount: string } } | null;
      if (meta?.ledgerEntry) {
        const amount = new Decimal(meta.ledgerEntry.amount);
        if (meta.ledgerEntry.type === "DEBIT") {
          totalDebits = totalDebits.plus(amount);
        } else {
          totalCredits = totalCredits.plus(amount);
        }
      }
    }

    const difference = totalDebits.minus(totalCredits);
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    const expectedBalance = wallet?.balanceUsd ?? new Decimal(0);

    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: difference.equals(expectedBalance),
    };
  }

  /**
   * Get all ledger entries for a wallet.
   */
  async getEntries(walletId: string): Promise<
    Array<{
      transactionId: string;
      type: "DEBIT" | "CREDIT";
      amount: Decimal;
      transactionType: TransactionType;
      description: string | null;
      createdAt: Date;
    }>
  > {
    const transactions = await prisma.transaction.findMany({
      where: { walletId, status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        amountUsd: true,
        type: true,
        description: true,
        metadata: true,
        createdAt: true,
      },
    });

    return transactions
      .map((tx) => {
        const meta = tx.metadata as { ledgerEntry?: { type: string; amount: string } } | null;
        if (!meta?.ledgerEntry) return null;
        return {
          transactionId: tx.id,
          type: meta.ledgerEntry.type as "DEBIT" | "CREDIT",
          amount: new Decimal(meta.ledgerEntry.amount),
          transactionType: tx.type,
          description: tx.description,
          createdAt: tx.createdAt,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }
}
