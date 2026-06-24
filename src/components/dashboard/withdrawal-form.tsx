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
import { ArrowDownToLine, AlertCircle } from "lucide-react"

export function WithdrawalForm() {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [address, setAddress] = useState("")

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownToLine className="size-5" />
          Withdraw Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 text-blue-500" />
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Withdrawals are processed within 24 hours. A minimum balance of $50 must be maintained.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Available Balance</Label>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-lg font-bold">$12,450.75</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input
            type="number"
            placeholder="Enter withdrawal amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="50"
            max="12450.75"
            step="0.01"
          />
          <p className="text-xs text-muted-foreground">
            Minimum withdrawal: $50.00 | Maximum: $12,450.75
          </p>
        </div>

        <div className="space-y-2">
          <Label>Withdrawal Method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select withdrawal method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wire">Wire Transfer</SelectItem>
              <SelectItem value="crypto">Cryptocurrency (USDC)</SelectItem>
              <SelectItem value="ach">ACH Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {method === "crypto" && (
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <Input
              placeholder="Enter your USDC wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-4 rounded-lg bg-muted p-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Processing Fee</p>
            <p className="text-sm font-medium">
              {method === "crypto" ? "$1.00" : method === "wire" ? "$25.00" : "$0.50"}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">You'll receive</p>
            <p className="text-sm font-medium">
              {amount
                ? `$${(parseFloat(amount) - (method === "crypto" ? 1 : method === "wire" ? 25 : 0.5)).toFixed(2)}`
                : "$0.00"}
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          variant="outline"
          disabled={!amount || !method}
        >
          Request Withdrawal
        </Button>
      </CardContent>
    </Card>
  )
}
