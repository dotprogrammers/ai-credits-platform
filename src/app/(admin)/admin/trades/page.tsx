"use client"

import { useState } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const mockTrades = [
  { id: "TRD-001", buyer: "Sarah Chen", seller: "James Wilson", pair: "GPT-4 / Claude", amount: "$2,400", fee: "$48", status: "completed", date: "2024-06-15 14:30" },
  { id: "TRD-002", buyer: "Lisa Park", seller: "Emily Davis", pair: "Gemini / GPT-4", amount: "$1,800", fee: "$36", status: "completed", date: "2024-06-15 13:15" },
  { id: "TRD-003", buyer: "David Kim", seller: "Sarah Chen", pair: "Claude / Mistral", amount: "$950", fee: "$19", status: "pending", date: "2024-06-15 12:00" },
  { id: "TRD-004", buyer: "Alex Rivera", seller: "James Wilson", pair: "GPT-4 / Gemini", amount: "$3,200", fee: "$64", status: "completed", date: "2024-06-14 18:45" },
  { id: "TRD-005", buyer: "Maria Santos", seller: "Emily Davis", pair: "Mistral / Claude", amount: "$600", fee: "$12", status: "disputed", date: "2024-06-14 16:30" },
  { id: "TRD-006", buyer: "Nina Patel", seller: "Sarah Chen", pair: "GPT-4 / GPT-4", amount: "$5,000", fee: "$100", status: "completed", date: "2024-06-14 10:20" },
  { id: "TRD-007", buyer: "Ryan Lee", seller: "Lisa Park", pair: "Claude / Gemini", amount: "$1,100", fee: "$22", status: "cancelled", date: "2024-06-13 22:15" },
  { id: "TRD-008", buyer: "Tom Brown", seller: "James Wilson", pair: "GPT-4 / Claude", amount: "$750", fee: "$15", status: "completed", date: "2024-06-13 15:00" },
]

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  disputed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
}

export default function AdminTradesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockTrades.filter((trade) => {
    const matchesSearch =
      trade.id.toLowerCase().includes(search.toLowerCase()) ||
      trade.buyer.toLowerCase().includes(search.toLowerCase()) ||
      trade.seller.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || trade.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trades</h1>
          <p className="text-sm text-muted-foreground">
            All platform trades and transactions
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v != null && setStatusFilter(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trade ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Pair</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-mono text-xs">{trade.id}</TableCell>
                <TableCell className="text-sm">{trade.buyer}</TableCell>
                <TableCell className="text-sm">{trade.seller}</TableCell>
                <TableCell className="text-sm font-medium">{trade.pair}</TableCell>
                <TableCell className="text-right font-medium">{trade.amount}</TableCell>
                <TableCell className="text-right text-muted-foreground">{trade.fee}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[trade.status])}>
                    {trade.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{trade.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-xs">
                    <Eye className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockTrades.length} trades
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
