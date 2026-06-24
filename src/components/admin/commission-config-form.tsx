"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"

interface CommissionConfig {
  tradeFee: string
  listingFee: string
  auctionFee: string
  withdrawalFee: string
  minTrade: string
  maxTrade: string
}

interface CommissionConfigFormProps {
  initialData?: Partial<CommissionConfig>
  onSubmit?: (data: CommissionConfig) => void
}

export function CommissionConfigForm({ initialData, onSubmit }: CommissionConfigFormProps) {
  const [config, setConfig] = useState<CommissionConfig>({
    tradeFee: initialData?.tradeFee ?? "2.0",
    listingFee: initialData?.listingFee ?? "0.50",
    auctionFee: initialData?.auctionFee ?? "3.0",
    withdrawalFee: initialData?.withdrawalFee ?? "1.5",
    minTrade: initialData?.minTrade ?? "10.00",
    maxTrade: initialData?.maxTrade ?? "100000",
  })

  const handleChange = (field: keyof CommissionConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(config)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Trade Fee (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={config.tradeFee}
            onChange={(e) => handleChange("tradeFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Listing Fee ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={config.listingFee}
            onChange={(e) => handleChange("listingFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Auction Fee (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={config.auctionFee}
            onChange={(e) => handleChange("auctionFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Withdrawal Fee (%)</Label>
          <Input
            type="number"
            step="0.1"
            value={config.withdrawalFee}
            onChange={(e) => handleChange("withdrawalFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Min Trade ($)</Label>
          <Input
            type="number"
            value={config.minTrade}
            onChange={(e) => handleChange("minTrade", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Trade ($)</Label>
          <Input
            type="number"
            value={config.maxTrade}
            onChange={(e) => handleChange("maxTrade", e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full gap-1.5">
        <Save className="size-3.5" />
        Save Configuration
      </Button>
    </form>
  )
}
