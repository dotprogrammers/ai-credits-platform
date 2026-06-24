"use client"

import { useState } from "react"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Download, ArrowUpRight, ArrowDownRight } from "lucide-react"

const TRADES = [
  { id: "trd_001", type: "buy", product: "GPT-4", quantity: 10000, price: 0.042, total: 420, status: "filled", date: "2024-12-15 14:30" },
  { id: "trd_002", type: "sell", product: "Claude", quantity: 5000, price: 0.038, total: 190, status: "filled", date: "2024-12-15 10:22" },
  { id: "trd_003", type: "buy", product: "Gemini", quantity: 25000, price: 0.025, total: 625, status: "partial", date: "2024-12-14 16:45" },
  { id: "trd_004", type: "sell", product: "Llama", quantity: 50000, price: 0.015, total: 750, status: "filled", date: "2024-12-14 09:15" },
  { id: "trd_005", type: "buy", product: "Midjourney", quantity: 2000, price: 0.085, total: 170, status: "cancelled", date: "2024-12-13 20:00" },
  { id: "trd_006", type: "buy", product: "GPT-4", quantity: 15000, price: 0.040, total: 600, status: "filled", date: "2024-12-13 11:30" },
  { id: "trd_007", type: "sell", product: "Gemini", quantity: 30000, price: 0.026, total: 780, status: "filled", date: "2024-12-12 15:20" },
  { id: "trd_008", type: "buy", product: "Claude", quantity: 8000, price: 0.037, total: 296, status: "pending", date: "2024-12-12 08:10" },
]

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  filled: "default",
  partial: "secondary",
  pending: "outline",
  cancelled: "destructive",
}

export function TradeHistoryTable() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = TRADES.filter((trade) => {
    if (typeFilter !== "all" && trade.type !== typeFilter) return false
    if (search && !trade.product.toLowerCase().includes(search.toLowerCase()) && !trade.id.includes(search)) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Trade History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by product or ID..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trade ID</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>
                  <Link href={`/history/${trade.id}`} className="font-mono text-xs text-primary hover:underline">
                    {trade.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {trade.type === "buy" ? (
                      <ArrowDownRight className="size-3 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="size-3 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${trade.type === "buy" ? "text-emerald-500" : "text-red-500"}`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{trade.product}</TableCell>
                <TableCell className="text-right font-mono">
                  {trade.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${trade.price.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono font-medium">
                  ${trade.total.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[trade.status] || "outline"}>
                    {trade.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {trade.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
