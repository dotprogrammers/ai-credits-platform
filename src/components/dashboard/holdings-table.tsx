"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useWallet } from "@/hooks/use-wallet"
import { TrendingUp, TrendingDown } from "lucide-react"

const HOLDINGS_DATA = [
  { provider: "OpenAI", product: "GPT-4", credits: 175000, avgCost: 0.038, currentPrice: 0.042, change24h: 3.2 },
  { provider: "Anthropic", product: "Claude", credits: 95000, avgCost: 0.035, currentPrice: 0.038, change24h: -1.5 },
  { provider: "Google", product: "Gemini", credits: 200000, avgCost: 0.022, currentPrice: 0.025, change24h: 5.8 },
  { provider: "Meta", product: "Llama", credits: 550000, avgCost: 0.013, currentPrice: 0.015, change24h: 1.2 },
  { provider: "Midjourney", product: "v6", credits: 15000, avgCost: 0.078, currentPrice: 0.085, change24h: -0.8 },
]

export function HoldingsTable() {
  const { isLoading } = useWallet()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Holdings by Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Avg Cost</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead className="text-right">24h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {HOLDINGS_DATA.map((holding) => {
              const value = holding.credits * holding.currentPrice
              const cost = holding.credits * holding.avgCost
              const pnl = value - cost
              const pnlPercent = ((value - cost) / cost) * 100
              const isPositive = pnl >= 0

              return (
                <TableRow key={holding.product}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{holding.provider}</span>
                      <span className="text-xs text-muted-foreground">{holding.product}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {holding.credits.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${holding.avgCost.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${holding.currentPrice.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}${pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={holding.change24h >= 0 ? "default" : "destructive"}
                      className="gap-1 text-[10px]"
                    >
                      {holding.change24h >= 0 ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {Math.abs(holding.change24h)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
