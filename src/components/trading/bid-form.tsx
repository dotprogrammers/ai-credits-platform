"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BidFormProps {
  currentBid: number
  onSubmit: (amount: number) => void
}

export function BidForm({ currentBid, onSubmit }: BidFormProps) {
  const [amount, setAmount] = useState("")
  const minBid = +(currentBid + 0.0004).toFixed(4)

  const handleSubmit = () => {
    const val = parseFloat(amount)
    if (val >= minBid) {
      onSubmit(val)
      setAmount("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Bid</span>
          <span className="font-mono font-bold">${currentBid.toFixed(4)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Minimum Bid</span>
          <span className="font-mono text-emerald-500">${minBid.toFixed(4)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Your Bid (USD per credit)</Label>
        <Input
          type="number"
          placeholder={`Min: $${minBid.toFixed(4)}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.0001"
          min={minBid}
        />
      </div>

      <div className="flex gap-2">
        {[0.001, 0.002, 0.005].map((increment) => (
          <Button
            key={increment}
            variant="outline"
            size="xs"
            className="flex-1"
            onClick={() => setAmount((currentBid + increment).toFixed(4))}
          >
            +${increment.toFixed(3)}
          </Button>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={!amount || parseFloat(amount) < minBid}
      >
        Place Bid
      </Button>
    </div>
  )
}
