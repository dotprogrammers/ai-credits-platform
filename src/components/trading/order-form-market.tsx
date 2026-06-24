"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface OrderFormMarketProps {
  side: "buy" | "sell"
  onSubmit: (quantity: string) => void
  bestPrice?: number
}

export function OrderFormMarket({ side, onSubmit, bestPrice }: OrderFormMarketProps) {
  const [quantity, setQuantity] = useState("")
  const estimatedTotal = bestPrice && quantity
    ? (bestPrice * parseFloat(quantity)).toFixed(2)
    : "0.00"

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-muted p-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Market Price</span>
          <span className="font-mono font-medium">
            {bestPrice ? `$${bestPrice.toFixed(4)}` : "N/A"}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Quantity (Credits)</Label>
        <Input
          type="number"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
        />
      </div>
      <div className="flex gap-2">
        {[25, 50, 75, 100].map((pct) => (
          <Button
            key={pct}
            variant="outline"
            size="xs"
            className="flex-1"
            onClick={() => setQuantity(String(Math.floor(pct * 100)))}
          >
            {pct}%
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted p-2 text-xs">
        <span className="text-muted-foreground">Estimated Total</span>
        <span className="font-mono font-medium">${estimatedTotal}</span>
      </div>
      <Button
        className={cn(
          "w-full",
          side === "buy" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        )}
        onClick={() => onSubmit(quantity)}
        disabled={!quantity}
      >
        {side === "buy" ? "Buy" : "Sell"} at Market
      </Button>
    </div>
  )
}
