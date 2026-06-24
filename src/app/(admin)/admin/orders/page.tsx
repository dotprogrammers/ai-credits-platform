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
import { Search, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const mockOrders = [
  { id: "ORD-001", user: "Sarah Chen", type: "buy", provider: "OpenAI", credits: "500", price: "$0.92", total: "$460", status: "filled", date: "2024-06-15 14:30" },
  { id: "ORD-002", user: "Lisa Park", type: "sell", provider: "Anthropic", credits: "1000", price: "$0.88", total: "$880", status: "open", date: "2024-06-15 13:00" },
  { id: "ORD-003", user: "David Kim", type: "buy", provider: "Google", credits: "200", price: "$0.75", total: "$150", status: "open", date: "2024-06-15 11:45" },
  { id: "ORD-004", user: "Maria Santos", type: "sell", provider: "OpenAI", credits: "300", price: "$0.95", total: "$285", status: "filled", date: "2024-06-14 18:00" },
  { id: "ORD-005", user: "Alex Rivera", type: "buy", provider: "Mistral", credits: "800", price: "$0.60", total: "$480", status: "cancelled", date: "2024-06-14 15:30" },
  { id: "ORD-006", user: "Nina Patel", type: "buy", provider: "Cohere", credits: "150", price: "$0.70", total: "$105", status: "open", date: "2024-06-14 12:00" },
  { id: "ORD-007", user: "Ryan Lee", type: "sell", provider: "Google", credits: "600", price: "$0.78", total: "$468", status: "filled", date: "2024-06-13 20:15" },
  { id: "ORD-008", user: "Tom Brown", type: "buy", provider: "Anthropic", credits: "250", price: "$0.90", total: "$225", status: "cancelled", date: "2024-06-13 16:45" },
]

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  filled: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.user.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesType = typeFilter === "all" || order.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            All open, filled, and cancelled orders
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
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => v != null && setTypeFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v != null && setStatusFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell className="text-sm">{order.user}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={order.type === "buy" ? "text-emerald-600" : "text-red-600"}>
                    {order.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">{order.provider}</TableCell>
                <TableCell className="text-right">{order.credits}</TableCell>
                <TableCell className="text-right">{order.price}</TableCell>
                <TableCell className="text-right font-medium">{order.total}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockOrders.length} orders
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
