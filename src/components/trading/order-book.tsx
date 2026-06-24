"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrderBook } from "@/hooks/use-orderbook"
import { OrderBookRow } from "@/components/trading/order-book-row"

interface OrderBookProps {
  productId: string
  compact?: boolean
}

export function OrderBook({ productId, compact = false }: OrderBookProps) {
  const { data, isLoading } = useOrderBook(productId)

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="mb-1 h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const maxBidTotal = data.bids.length > 0 ? data.bids[data.bids.length - 1].total : 0
  const maxAskTotal = data.asks.length > 0 ? data.asks[data.asks.length - 1].total : 0
  const maxTotal = Math.max(maxBidTotal, maxAskTotal)

  const displayBids = compact ? data.bids.slice(0, 8) : data.bids
  const displayAsks = compact ? data.asks.slice(0, 8) : data.asks

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* Header */}
        <div className="flex items-center px-2 py-1 text-[10px] font-medium uppercase text-muted-foreground">
          <span className="flex-1 text-left">Price</span>
          <span className="w-20 text-right">Quantity</span>
          <span className="w-24 text-right">Total</span>
        </div>

        {/* Asks (reversed so lowest ask is at bottom) */}
        <div className="space-y-px">
          {[...displayAsks].reverse().map((level, i) => (
            <OrderBookRow
              key={`ask-${i}`}
              level={level}
              side="ask"
              maxTotal={maxTotal}
            />
          ))}
        </div>

        {/* Spread */}
        <div className="flex items-center justify-center gap-2 border-y py-1.5">
          <span className="text-sm font-bold font-mono">${data.lastPrice.toFixed(4)}</span>
          <span className="text-[10px] text-muted-foreground">
            Spread: ${data.spread.toFixed(4)} ({data.spreadPercent.toFixed(2)}%)
          </span>
        </div>

        {/* Bids */}
        <div className="space-y-px">
          {displayBids.map((level, i) => (
            <OrderBookRow
              key={`bid-${i}`}
              level={level}
              side="bid"
              maxTotal={maxTotal}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
