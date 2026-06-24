"use client"

import { cn } from "@/lib/utils"
import type { OrderBookLevel } from "@/hooks/use-orderbook"

interface OrderBookRowProps {
  level: OrderBookLevel
  side: "bid" | "ask"
  maxTotal: number
  onClick?: (price: number) => void
}

export function OrderBookRow({ level, side, maxTotal, onClick }: OrderBookRowProps) {
  const depthPercent = (level.total / maxTotal) * 100

  return (
    <button
      onClick={() => onClick?.(level.price)}
      className={cn(
        "relative flex w-full items-center px-2 py-0.5 text-xs font-mono transition-colors hover:bg-muted/50",
        side === "bid" ? "text-emerald-500" : "text-red-500"
      )}
    >
      {/* Depth bar */}
      <div
        className={cn(
          "absolute inset-y-0 transition-all",
          side === "bid"
            ? "right-0 bg-emerald-500/10"
            : "right-0 bg-red-500/10"
        )}
        style={{ width: `${depthPercent}%` }}
      />
      <span className="relative z-10 flex-1 text-left">
        ${level.price.toFixed(4)}
      </span>
      <span className="relative z-10 w-20 text-right">
        {level.quantity.toLocaleString()}
      </span>
      <span className="relative z-10 w-24 text-right text-muted-foreground">
        {level.total.toLocaleString()}
      </span>
    </button>
  )
}
