"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const RECENT_TRADES = [
  { id: "trd_001", type: "buy" as const, product: "GPT-4", quantity: 10000, price: 0.042, total: 420, time: "2m ago" },
  { id: "trd_002", type: "sell" as const, product: "Claude", quantity: 5000, price: 0.038, total: 190, time: "15m ago" },
  { id: "trd_003", type: "buy" as const, product: "Gemini", quantity: 25000, price: 0.025, total: 625, time: "1h ago" },
  { id: "trd_004", type: "sell" as const, product: "Llama", quantity: 50000, price: 0.015, total: 750, time: "3h ago" },
  { id: "trd_005", type: "buy" as const, product: "Midjourney", quantity: 2000, price: 0.085, total: 170, time: "5h ago" },
]

export function RecentTrades() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Trades</CardTitle>
        <Link href="/history">
          <Button variant="ghost" size="sm">View all</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {RECENT_TRADES.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-full ${
                    trade.type === "buy"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {trade.type === "buy" ? (
                    <ArrowDownRight className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {trade.type === "buy" ? "Bought" : "Sold"} {trade.product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {trade.quantity.toLocaleString()} credits @ ${trade.price.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${trade.total.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{trade.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
