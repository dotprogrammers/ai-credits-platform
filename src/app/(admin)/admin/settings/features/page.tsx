"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  category: "core" | "trading" | "ui" | "experimental"
}

const initialFlags: FeatureFlag[] = [
  { id: "1", name: "Auction System", description: "Enable the auction marketplace for bulk credit sales", enabled: true, category: "trading" },
  { id: "2", name: "Limit Orders", description: "Allow users to place limit buy/sell orders", enabled: true, category: "trading" },
  { id: "3", name: "Dark Mode", description: "Enable dark mode toggle in user settings", enabled: true, category: "ui" },
  { id: "4", name: "API Access", description: "Allow users to access the trading API", enabled: true, category: "core" },
  { id: "5", name: "Referral Program", description: "Enable the affiliate referral system", enabled: true, category: "core" },
  { id: "6", name: "Portfolio Analytics", description: "Advanced portfolio analytics dashboard", enabled: false, category: "ui" },
  { id: "7", name: "AI Price Predictions", description: "ML-based price prediction for credits", enabled: false, category: "experimental" },
  { id: "8", name: "Escrow System", description: "Escrow protection for large trades", enabled: true, category: "trading" },
  { id: "9", name: "Multi-currency Support", description: "Support payments in multiple currencies", enabled: false, category: "core" },
  { id: "10", name: "WebSocket Live Feed", description: "Real-time price feed via WebSocket", enabled: true, category: "experimental" },
]

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState(initialFlags)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const toggleFlag = (id: string) => {
    setFlags(
      flags.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    )
  }

  const filtered = flags.filter((flag) => {
    const matchesSearch =
      flag.name.toLowerCase().includes(search.toLowerCase()) ||
      flag.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || flag.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "core", "trading", "ui", "experimental"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-sm text-muted-foreground">
            Toggle platform features on and off
          </p>
        </div>
        <Button className="gap-1.5">
          <Save className="size-3.5" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((flag) => (
          <Card key={flag.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <button
                onClick={() => toggleFlag(flag.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  flag.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white transition-transform ${
                    flag.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{flag.name}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {flag.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
              </div>
              <Badge
                variant={flag.enabled ? "default" : "secondary"}
                className={cn(
                  "text-[10px]",
                  flag.enabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : ""
                )}
              >
                {flag.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
