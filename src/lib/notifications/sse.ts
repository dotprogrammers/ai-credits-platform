import { SSE_HEARTBEAT_INTERVAL_MS, SSE_RECONNECT_INTERVAL_MS } from "@/lib/constants";

/**
 * Server-Sent Events (SSE) connection management.
 * Handles connection lifecycle, heartbeats, and reconnection.
 */

interface SSEConnection {
  id: string;
  userId: string;
  controller: ReadableStreamDefaultController;
  channels: Set<string>;
  connectedAt: Date;
  heartbeatTimer: ReturnType<typeof setInterval> | null;
}

/**
 * Registry of active SSE connections.
 */
const connections = new Map<string, SSEConnection>();

/**
 * Create an SSE response for a client.
 */
export function createSSEResponse(userId: string, request: Request): ReadableStream {
  const connectionId = generateConnectionId();

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection event
      const connectEvent = formatSSE({
        event: "connected",
        data: JSON.stringify({
          connectionId,
          retry: SSE_RECONNECT_INTERVAL_MS,
        }),
      });
      controller.enqueue(encoder.encode(connectEvent));

      // Register the connection
      const connection: SSEConnection = {
        id: connectionId,
        userId,
        controller,
        channels: new Set([`user:${userId}:notifications`]),
        connectedAt: new Date(),
        heartbeatTimer: null,
      };

      connections.set(connectionId, connection);

      // Start heartbeat
      connection.heartbeatTimer = setInterval(() => {
        try {
          const heartbeat = formatSSE({ event: "heartbeat", data: "" });
          controller.enqueue(encoder.encode(heartbeat));
        } catch {
          // Client disconnected
          cleanupConnection(connectionId);
        }
      }, SSE_HEARTBEAT_INTERVAL_MS);
    },

    cancel() {
      // Client disconnected - find and clean up
      for (const [id, conn] of connections.entries()) {
        if (conn.userId === userId) {
          cleanupConnection(id);
          break;
        }
      }
    },
  });

  return stream;
}

/**
 * Send an event to a specific user's SSE connections.
 */
export function sendToUser(userId: string, event: string, data: unknown): void {
  const encoder = new TextEncoder();
  const message = formatSSE({
    event,
    data: JSON.stringify(data),
  });

  for (const conn of connections.values()) {
    if (conn.userId === userId) {
      try {
        conn.controller.enqueue(encoder.encode(message));
      } catch {
        cleanupConnection(conn.id);
      }
    }
  }
}

/**
 * Send an event to all connections subscribed to a channel.
 */
export function sendToChannel(channel: string, event: string, data: unknown): void {
  const encoder = new TextEncoder();
  const message = formatSSE({
    event,
    data: JSON.stringify(data),
  });

  for (const conn of connections.values()) {
    if (conn.channels.has(channel)) {
      try {
        conn.controller.enqueue(encoder.encode(message));
      } catch {
        cleanupConnection(conn.id);
      }
    }
  }
}

/**
 * Subscribe a user's connection to a channel.
 */
export function subscribeToChannel(userId: string, channel: string): void {
  for (const conn of connections.values()) {
    if (conn.userId === userId) {
      conn.channels.add(channel);
    }
  }
}

/**
 * Unsubscribe a user's connection from a channel.
 */
export function unsubscribeFromChannel(userId: string, channel: string): void {
  for (const conn of connections.values()) {
    if (conn.userId === userId) {
      conn.channels.delete(channel);
    }
  }
}

/**
 * Get connection stats.
 */
export function getConnectionStats(): {
  totalConnections: number;
  uniqueUsers: number;
} {
  const uniqueUsers = new Set<string>();
  for (const conn of connections.values()) {
    uniqueUsers.add(conn.userId);
  }

  return {
    totalConnections: connections.size,
    uniqueUsers: uniqueUsers.size,
  };
}

/**
 * Clean up a connection.
 */
function cleanupConnection(connectionId: string): void {
  const conn = connections.get(connectionId);
  if (conn) {
    if (conn.heartbeatTimer) {
      clearInterval(conn.heartbeatTimer);
    }
    try {
      conn.controller.close();
    } catch {
      // Already closed
    }
    connections.delete(connectionId);
  }
}

/**
 * Format an SSE message.
 */
function formatSSE(params: { event?: string; data: string; id?: string }): string {
  let message = "";
  if (params.id) message += `id: ${params.id}\n`;
  if (params.event) message += `event: ${params.event}\n`;
  if (params.data) message += `data: ${params.data}\n`;
  message += "\n";
  return message;
}

/**
 * Generate a unique connection ID.
 */
function generateConnectionId(): string {
  return `sse_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
