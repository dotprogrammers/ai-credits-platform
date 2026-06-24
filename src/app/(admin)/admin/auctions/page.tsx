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
import { Search, Eye, Ban, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const mockAuctions = [
  { id: "AUC-001", title: "1000 OpenAI Credits (Bulk)", seller: "James Wilson", currentBid: "$820", bids: 12, endTime: "2024-06-16 14:00", status: "active" },
  { id: "AUC-002", title: "500 Claude Credits", seller: "Emily Davis", currentBid: "$440", bids: 8, endTime: "2024-06-16 18:00", status: "active" },
  { id: "AUC-003", title: "2000 Gemini Credits Bundle", seller: "Sarah Chen", currentBid: "$1,500", bids: 15, endTime: "2024-06-15 12:00", status: "ended" },
  { id: "AUC-004", title: "300 Mistral Credits", seller: "Lisa Park", currentBid: "$180", bids: 4, endTime: "2024-06-17 10:00", status: "active" },
  { id: "AUC-005", title: "Premium API Access - 1 Month", seller: "David Kim", currentBid: "$350", bids: 6, endTime: "2024-06-14 20:00", status: "cancelled" },
  { id: "AUC-006", title: "750 Cohere Credits", seller: "Nina Patel", currentBid: "$525", bids: 9, endTime: "2024-06-15 08:00", status: "ended" },
]

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ended: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function AdminAuctionsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = mockAuctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(search.toLowerCase()) ||
      auction.seller.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || auction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auctions</h1>
        <p className="text-sm text-muted-foreground">
          Manage all platform auctions
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search auctions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => v != null && setStatusFilter(v)}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Current Bid</TableHead>
              <TableHead className="text-right">Bids</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell className="font-mono text-xs">{auction.id}</TableCell>
                <TableCell className="text-sm font-medium">{auction.title}</TableCell>
                <TableCell className="text-sm">{auction.seller}</TableCell>
                <TableCell className="text-right font-semibold">{auction.currentBid}</TableCell>
                <TableCell className="text-right text-muted-foreground">{auction.bids}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{auction.endTime}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[auction.status])}>
                    {auction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-xs">
                      <Eye className="size-3.5" />
                    </Button>
                    {auction.status === "active" && (
                      <Button variant="ghost" size="icon-xs" className="text-red-600">
                        <Ban className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockAuctions.length} auctions
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
