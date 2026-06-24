import { createSSEResponse, sendToUser, subscribeToChannel } from "@/lib/notifications/sse";

/**
 * SSE response helper for Next.js App Router.
 * Creates a proper streaming response for Server-Sent Events.
 */
export function createSSEHandler(userId: string) {
  return function GET(request: Request) {
    const stream = createSSEResponse(userId, request);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  };
}

/**
 * Create an SSE endpoint with channel subscription support.
 */
export function createSSEEndpoint(userId: string, channels: string[] = []) {
  return function GET(request: Request) {
    const stream = createSSEResponse(userId, request);

    // Subscribe to additional channels
    for (const channel of channels) {
      subscribeToChannel(userId, channel);
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  };
}

/**
 * Send a message to a user via SSE.
 * Convenience wrapper around the SSE module.
 */
export function pushToUser(userId: string, event: string, data: unknown): void {
  sendToUser(userId, event, data);
}
