"use client"

import { cn } from "@/lib/utils"

interface SpreadIndicatorProps {
  spread: number
  spreadPercent: number
  lastPrice: number
  className?: string
}

export function SpreadIndicator({ spread, spreadPercent, lastPrice, className }: SpreadIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border px-3 py-2", className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Last</span>
        <span className="text-sm font-bold font-mono">${lastPrice.toFixed(4)}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Spread</span>
        <span className="text-sm font-mono">${spread.toFixed(4)}</span>
        <span className={cn(
          "text-xs font-mono",
          spreadPercent < 2 ? "text-emerald-500" : spreadPercent < 5 ? "text-amber-500" : "text-red-500"
        )}>
          ({spreadPercent.toFixed(2)}%)
        </span>
      </div>
    </div>
  )
}
