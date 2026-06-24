type EventHandler = (data: unknown) => void;

/**
 * Central pub/sub hub for real-time events.
 * Provides an in-memory event bus for server-side event distribution.
 */
class EventHub {
  private subscribers: Map<string, Set<EventHandler>> = new Map();

  /**
   * Subscribe to events on a channel.
   * Returns an unsubscribe function.
   */
  subscribe(channel: string, handler: EventHandler): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }

    this.subscribers.get(channel)!.add(handler);

    return () => {
      this.subscribers.get(channel)?.delete(handler);
    };
  }

  /**
   * Publish an event to all subscribers on a channel.
   */
  publish(channel: string, payload: { event: string; data: unknown }): void {
    const handlers = this.subscribers.get(channel);
    if (!handlers) return;

    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Event hub handler error on channel "${channel}":`, error);
      }
    }
  }

  /**
   * Publish an event to multiple channels.
   */
  publishMany(
    channels: string[],
    payload: { event: string; data: unknown }
  ): void {
    for (const channel of channels) {
      this.publish(channel, payload);
    }
  }

  /**
   * Remove all subscribers for a channel.
   */
  clearChannel(channel: string): void {
    this.subscribers.delete(channel);
  }

  /**
   * Remove all subscribers for all channels.
   */
  clearAll(): void {
    this.subscribers.clear();
  }

  /**
   * Get the number of subscribers for a channel.
   */
  getSubscriberCount(channel: string): number {
    return this.subscribers.get(channel)?.size ?? 0;
  }

  /**
   * Get all active channel names.
   */
  getChannels(): string[] {
    return Array.from(this.subscribers.keys());
  }

  /**
   * Get stats about the event hub.
   */
  getStats(): {
    totalChannels: number;
    totalSubscribers: number;
  } {
    let totalSubscribers = 0;
    for (const handlers of this.subscribers.values()) {
      totalSubscribers += handlers.size;
    }

    return {
      totalChannels: this.subscribers.size,
      totalSubscribers,
    };
  }
}

// Singleton instance
export const eventHub = new EventHub();
