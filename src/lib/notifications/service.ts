import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import type { NotificationType } from "@prisma/client";
import { eventHub } from "@/lib/streaming/hub";

/**
 * Notification service for creating and dispatching notifications.
 */
export class NotificationService {
  /**
   * Create a notification for a user.
   */
  async create(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, unknown>;
  }): Promise<{ id: string }> {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        data: (params.data as Prisma.InputJsonValue) ?? undefined,
      },
    });

    // Dispatch via SSE to connected clients
    eventHub.publish(`user:${params.userId}:notifications`, {
      event: "notification",
      data: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: false,
        createdAt: notification.createdAt,
      },
    });

    return { id: notification.id };
  }

  /**
   * Get notifications for a user.
   */
  async getNotifications(params: {
    userId: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { userId, isRead, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(isRead !== undefined ? { isRead } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark notifications as read.
   */
  async markAsRead(userId: string, notificationIds?: string[]): Promise<number> {
    const where = {
      userId,
      isRead: false,
      ...(notificationIds ? { id: { in: notificationIds } } : {}),
    };

    const result = await prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    // Notify the client about the read status change
    eventHub.publish(`user:${userId}:notifications`, {
      event: "notifications_read",
      data: {
        count: result.count,
        notificationIds,
      },
    });

    return result.count;
  }

  /**
   * Get unread notification count.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Delete a notification.
   */
  async delete(userId: string, notificationId: string): Promise<void> {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }

  // ─── Convenience methods for common notification types ───

  async notifyOrderFilled(userId: string, orderId: string, details: Record<string, unknown>) {
    return this.create({
      userId,
      type: "ORDER_FILLED",
      title: "Order Filled",
      message: `Your order #${orderId.slice(0, 8)} has been filled.`,
      data: { orderId, ...details },
    });
  }

  async notifyAuctionWon(userId: string, auctionId: string, details: Record<string, unknown>) {
    return this.create({
      userId,
      type: "AUCTION_WON",
      title: "Auction Won!",
      message: `Congratulations! You won auction #${auctionId.slice(0, 8)}.`,
      data: { auctionId, ...details },
    });
  }

  async notifyAuctionOutbid(userId: string, auctionId: string) {
    return this.create({
      userId,
      type: "AUCTION_OUTBID",
      title: "You've Been Outbid",
      message: `Your bid on auction #${auctionId.slice(0, 8)} has been exceeded.`,
      data: { auctionId },
    });
  }

  async notifyDepositConfirmed(userId: string, amount: string) {
    return this.create({
      userId,
      type: "DEPOSIT_CONFIRMED",
      title: "Deposit Confirmed",
      message: `Your deposit of ${amount} has been confirmed.`,
    });
  }

  async notifyWithdrawalProcessed(userId: string, amount: string) {
    return this.create({
      userId,
      type: "WITHDRAWAL_PROCESSED",
      title: "Withdrawal Processed",
      message: `Your withdrawal of ${amount} has been processed.`,
    });
  }

  async notifyKycApproved(userId: string) {
    return this.create({
      userId,
      type: "KYC_APPROVED",
      title: "KYC Verified",
      message: "Your identity has been verified. You now have full access to all platform features.",
    });
  }

  async notifyKycRejected(userId: string, reason: string) {
    return this.create({
      userId,
      type: "KYC_REJECTED",
      title: "KYC Verification Failed",
      message: `Your KYC verification was rejected. Reason: ${reason}`,
      data: { reason },
    });
  }

  async notifyAffiliateCommission(userId: string, amount: string) {
    return this.create({
      userId,
      type: "AFFILIATE_COMMISSION",
      title: "Affiliate Commission Earned",
      message: `You earned ${amount} in affiliate commission.`,
    });
  }
}

export const notificationService = new NotificationService();
