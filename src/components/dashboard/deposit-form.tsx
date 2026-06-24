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
import { Upload, AlertCircle } from "lucide-react"

export function DepositForm() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          Deposit Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 text-amber-500" />
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Deposits are processed within 1-3 business days. Ensure your payment method is verified.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input
            type="number"
            placeholder="Enter deposit amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            step="0.01"
          />
          <p className="text-xs text-muted-foreground">Minimum deposit: $10.00</p>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wire">Wire Transfer</SelectItem>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="crypto">Cryptocurrency (USDC)</SelectItem>
              <SelectItem value="ach">ACH Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 rounded-lg bg-muted p-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Processing Fee</p>
            <p className="text-sm font-medium">$0.00</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">You'll receive</p>
            <p className="text-sm font-medium">
              {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
            </p>
          </div>
        </div>

        <Button className="w-full" size="lg" disabled={!amount || !method}>
          Deposit ${amount || "0.00"}
        </Button>
      </CardContent>
    </Card>
  )
}
