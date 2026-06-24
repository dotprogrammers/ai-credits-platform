"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Info } from "lucide-react"

interface CommissionTier {
  minVolume: string
  maxVolume: string
  rate: string
}

export default function AdminCommissionsPage() {
  const [tradeFee, setTradeFee] = useState("2.0")
  const [listingFee, setListingFee] = useState("0.50")
  const [auctionFee, setAuctionFee] = useState("3.0")
  const [withdrawalFee, setWithdrawalFee] = useState("1.5")
  const [minimumTrade, setMinimumTrade] = useState("10.00")
  const [maximumTrade, setMaximumTrade] = useState("100000")

  const [tiers, setTiers] = useState<CommissionTier[]>([
    { minVolume: "0", maxVolume: "10000", rate: "2.0" },
    { minVolume: "10000", maxVolume: "50000", rate: "1.5" },
    { minVolume: "50000", maxVolume: "100000", rate: "1.0" },
    { minVolume: "100000", maxVolume: "∞", rate: "0.75" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission Configuration</h1>
          <p className="text-sm text-muted-foreground">
            Configure platform fees and commission rates
          </p>
        </div>
        <Button className="gap-1.5">
          <Save className="size-3.5" />
          Save Changes
        </Button>
      </div>

      {/* Base Fees */}
      <Card>
        <CardHeader>
          <CardTitle>Base Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Trade Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={tradeFee}
                onChange={(e) => setTradeFee(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Percentage charged on each completed trade
              </p>
            </div>
            <div className="space-y-2">
              <Label>Listing Fee ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={listingFee}
                onChange={(e) => setListingFee(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Flat fee for creating a new listing
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Auction Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={auctionFee}
                onChange={(e) => setAuctionFee(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Percentage charged on auction wins
              </p>
            </div>
            <div className="space-y-2">
              <Label>Withdrawal Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={withdrawalFee}
                onChange={(e) => setWithdrawalFee(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                Fee charged on fund withdrawals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Trade Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Minimum Trade Amount ($)</Label>
              <Input
                type="number"
                value={minimumTrade}
                onChange={(e) => setMinimumTrade(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Trade Amount ($)</Label>
              <Input
                type="number"
                value={maximumTrade}
                onChange={(e) => setMaximumTrade(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume-based Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Volume-Based Commission Tiers</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setTiers([
                  ...tiers,
                  { minVolume: "", maxVolume: "", rate: "" },
                ])
              }
            >
              Add Tier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground">
              <span>Min Volume ($)</span>
              <span>Max Volume ($)</span>
              <span>Rate (%)</span>
              <span></span>
            </div>
            {tiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <Input
                  value={tier.minVolume}
                  onChange={(e) => {
                    const newTiers = [...tiers]
                    newTiers[index] = { ...tier, minVolume: e.target.value }
                    setTiers(newTiers)
                  }}
                />
                <Input
                  value={tier.maxVolume}
                  onChange={(e) => {
                    const newTiers = [...tiers]
                    newTiers[index] = { ...tier, maxVolume: e.target.value }
                    setTiers(newTiers)
                  }}
                />
                <Input
                  value={tier.rate}
                  onChange={(e) => {
                    const newTiers = [...tiers]
                    newTiers[index] = { ...tier, rate: e.target.value }
                    setTiers(newTiers)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-red-600 self-center"
                  onClick={() => setTiers(tiers.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
        <Info className="size-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
            Commission Changes
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400/80">
            Commission changes will only affect new trades. Existing trades will retain their original fee structure.
          </p>
        </div>
      </div>
    </div>
  )
}
