"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign } from "lucide-react"

export function PayoutRequestForm() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="size-5" />
          Request Payout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available for Payout</span>
            <span className="font-bold font-mono">$142.30</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Minimum payout: $50.00
          </p>
        </div>

        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input
            type="number"
            placeholder="Enter payout amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="50"
            max="142.30"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label>Payout Method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payout method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balance">Account Balance</SelectItem>
              <SelectItem value="crypto">Cryptocurrency (USDC)</SelectItem>
              <SelectItem value="wire">Wire Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!amount || !method || parseFloat(amount) < 50}
        >
          Request Payout
        </Button>
      </CardContent>
    </Card>
  )
}
