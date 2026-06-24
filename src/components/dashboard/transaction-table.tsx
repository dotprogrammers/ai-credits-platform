"use client"

import { useState } from "react"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Download } from "lucide-react"

const TRANSACTIONS = [
  { id: "txn_001", type: "deposit", amount: 5000, status: "completed", method: "Wire Transfer", date: "2024-12-15 14:30" },
  { id: "txn_002", type: "trade", amount: -420, status: "completed", method: "GPT-4 Purchase", date: "2024-12-15 10:22" },
  { id: "txn_003", type: "trade", amount: 190, status: "completed", method: "Claude Sale", date: "2024-12-14 16:45" },
  { id: "txn_004", type: "withdrawal", amount: -2000, status: "pending", method: "ACH Transfer", date: "2024-12-14 09:15" },
  { id: "txn_005", type: "commission", amount: 42.50, status: "completed", method: "Affiliate Commission", date: "2024-12-13 20:00" },
  { id: "txn_006", type: "deposit", amount: 10000, status: "completed", method: "USDC", date: "2024-12-13 11:30" },
  { id: "txn_007", type: "trade", amount: -625, status: "completed", method: "Gemini Purchase", date: "2024-12-12 15:20" },
  { id: "txn_008", type: "trade", amount: 750, status: "completed", method: "Llama Sale", date: "2024-12-12 08:10" },
  { id: "txn_009", type: "withdrawal", amount: -3000, status: "completed", method: "Wire Transfer", date: "2024-12-11 14:00" },
  { id: "txn_010", type: "deposit", amount: 2500, status: "failed", method: "Credit Card", date: "2024-12-10 09:45" },
]

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
}

export function TransactionTable() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [page, setPage] = useState(1)

  const filtered = TRANSACTIONS.filter((txn) => {
    if (typeFilter !== "all" && txn.type !== typeFilter) return false
    if (search && !txn.id.toLowerCase().includes(search.toLowerCase()) && !txn.method.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Transaction History</CardTitle>
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
              placeholder="Search transactions..."
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
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="trade">Trades</SelectItem>
              <SelectItem value="commission">Commissions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                <TableCell className="capitalize">{txn.type}</TableCell>
                <TableCell>{txn.method}</TableCell>
                <TableCell className={`text-right font-mono ${txn.amount >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[txn.status] || "outline"}>
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {txn.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage(Math.max(1, page - 1)) }}
                />
              </PaginationItem>
              {[1, 2, 3].map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => { e.preventDefault(); setPage(p) }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage(Math.min(3, page + 1)) }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
