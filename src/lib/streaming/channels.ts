/**
 * Channel definitions for real-time event streaming.
 * Each channel follows the pattern: {scope}:{id}:{eventType}
 */

export const Channels = {
  /**
   * User-specific notification channel.
   * Receives: new notifications, read status updates.
   */
  userNotifications: (userId: string) => `user:${userId}:notifications`,

  /**
   * User-specific wallet updates.
   * Receives: balance changes, transaction completions.
   */
  userWallet: (userId: string) => `user:${userId}:wallet`,

  /**
   * User-specific order updates.
   * Receives: order status changes, fills.
   */
  userOrders: (userId: string) => `user:${userId}:orders`,

  /**
   * Product order book updates.
   * Receives: order book snapshots, top-of-book changes.
   */
  orderBook: (productId: string) => `product:${productId}:orderbook`,

  /**
   * Product trade feed.
   * Receives: new trades, price updates.
   */
  tradeFeed: (productId: string) => `product:${productId}:trades`,

  /**
   * Product ticker / market stats.
   * Receives: price, volume, spread updates.
   */
  ticker: (productId: string) => `product:${productId}:ticker`,

  /**
   * Auction updates.
   * Receives: new bids, auction status changes.
   */
  auction: (auctionId: string) => `auction:${auctionId}`,

  /**
   * Platform-wide announcements.
   * Receives: system announcements, maintenance notices.
   */
  announcements: () => "platform:announcements",

  /**
   * Admin event feed.
   * Receives: audit events, system alerts.
   */
  adminFeed: () => "admin:feed",
} as const;

/**
 * Event types that can be emitted on channels.
 */
export const EventTypes = {
  // Notification events
  NOTIFICATION: "notification",
  NOTIFICATIONS_READ: "notifications_read",

  // Wallet events
  BALANCE_UPDATE: "balance_update",
  TRANSACTION_COMPLETED: "transaction_completed",

  // Order events
  ORDER_CREATED: "order_created",
  ORDER_FILLED: "order_filled",
  ORDER_PARTIALLY_FILLED: "order_partially_filled",
  ORDER_CANCELLED: "order_cancelled",
  ORDER_EXPIRED: "order_expired",

  // Order book events
  ORDER_BOOK_UPDATE: "order_book_update",
  ORDER_BOOK_SNAPSHOT: "order_book_snapshot",

  // Trade events
  TRADE: "trade",

  // Ticker events
  TICKER_UPDATE: "ticker_update",

  // Auction events
  AUCTION_BID: "auction_bid",
  AUCTION_ENDED: "auction_ended",
  AUCTION_SETTLED: "auction_settled",

  // System events
  ANNOUNCEMENT: "announcement",
  SYSTEM_ALERT: "system_alert",

  // Connection events
  CONNECTED: "connected",
  HEARTBEAT: "heartbeat",
} as const;

export type ChannelFactory = (typeof Channels)[keyof typeof Channels];
export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
