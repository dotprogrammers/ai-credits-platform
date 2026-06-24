"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface OrderFormLimitProps {
  side: "buy" | "sell"
  onSubmit: (price: string, quantity: string) => void
}

export function OrderFormLimit({ side, onSubmit }: OrderFormLimitProps) {
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")

  const total = price && quantity ? (parseFloat(price) * parseFloat(quantity)).toFixed(2) : "0.00"

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Price (USD)</Label>
        <Input
          type="number"
          placeholder="0.0000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.0001"
          min="0"
        />
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
        <span className="text-muted-foreground">Total</span>
        <span className="font-mono font-medium">${total}</span>
      </div>
      <Button
        className={cn(
          "w-full",
          side === "buy" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
        )}
        onClick={() => onSubmit(price, quantity)}
        disabled={!price || !quantity}
      >
        {side === "buy" ? "Buy" : "Sell"} Limit Order
      </Button>
    </div>
  )
}
