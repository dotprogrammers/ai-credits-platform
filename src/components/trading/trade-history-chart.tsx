"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const RECENT_TRADES = [
  { price: 0.042, quantity: 5000, side: "buy" as const, time: "14:30:22" },
  { price: 0.0418, quantity: 2500, side: "sell" as const, time: "14:29:45" },
  { price: 0.0421, quantity: 10000, side: "buy" as const, time: "14:29:12" },
  { price: 0.0419, quantity: 3000, side: "sell" as const, time: "14:28:55" },
  { price: 0.0422, quantity: 8000, side: "buy" as const, time: "14:28:30" },
  { price: 0.042, quantity: 1500, side: "buy" as const, time: "14:27:48" },
  { price: 0.0417, quantity: 7000, side: "sell" as const, time: "14:27:15" },
  { price: 0.0423, quantity: 4000, side: "buy" as const, time: "14:26:42" },
  { price: 0.0416, quantity: 6000, side: "sell" as const, time: "14:26:10" },
  { price: 0.0424, quantity: 2000, side: "buy" as const, time: "14:25:38" },
]

export function TradeHistoryChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-px">
          <div className="flex items-center px-1 py-1 text-[10px] font-medium uppercase text-muted-foreground">
            <span className="flex-1">Price</span>
            <span className="w-20 text-right">Quantity</span>
            <span className="w-16 text-right">Time</span>
          </div>
          {RECENT_TRADES.map((trade, i) => (
            <div
              key={i}
              className="flex items-center px-1 py-0.5 text-xs font-mono"
            >
              <span className={`flex flex-1 items-center gap-1 ${trade.side === "buy" ? "text-emerald-500" : "text-red-500"}`}>
                {trade.side === "buy" ? (
                  <ArrowDownRight className="size-3" />
                ) : (
                  <ArrowUpRight className="size-3" />
                )}
                ${trade.price.toFixed(4)}
              </span>
              <span className="w-20 text-right">{trade.quantity.toLocaleString()}</span>
              <span className="w-16 text-right text-muted-foreground">{trade.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
