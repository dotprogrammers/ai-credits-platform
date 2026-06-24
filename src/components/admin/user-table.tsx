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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "trader" | "provider" | "admin"
  status: "active" | "suspended" | "pending"
  kycStatus: "verified" | "pending" | "rejected" | "not_submitted"
  joinedAt: string
  balance: string
  trades: number
}

const mockUsers: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "trader", status: "active", kycStatus: "verified", joinedAt: "2024-01-15", balance: "$12,400", trades: 156 },
  { id: "2", name: "Alex Rivera", email: "alex@example.com", role: "user", status: "active", kycStatus: "pending", joinedAt: "2024-02-20", balance: "$3,200", trades: 23 },
  { id: "3", name: "James Wilson", email: "james@example.com", role: "provider", status: "active", kycStatus: "verified", joinedAt: "2024-01-05", balance: "$45,800", trades: 892 },
  { id: "4", name: "Maria Santos", email: "maria@example.com", role: "trader", status: "suspended", kycStatus: "verified", joinedAt: "2024-03-10", balance: "$0", trades: 45 },
  { id: "5", name: "David Kim", email: "david@example.com", role: "user", status: "active", kycStatus: "not_submitted", joinedAt: "2024-04-01", balance: "$800", trades: 5 },
  { id: "6", name: "Lisa Park", email: "lisa@example.com", role: "trader", status: "active", kycStatus: "verified", joinedAt: "2024-02-14", balance: "$8,900", trades: 234 },
  { id: "7", name: "Tom Brown", email: "tom@example.com", role: "user", status: "pending", kycStatus: "rejected", joinedAt: "2024-05-20", balance: "$0", trades: 0 },
  { id: "8", name: "Emily Davis", email: "emily@example.com", role: "provider", status: "active", kycStatus: "verified", joinedAt: "2024-01-28", balance: "$67,200", trades: 1205 },
  { id: "9", name: "Ryan Lee", email: "ryan@example.com", role: "user", status: "active", kycStatus: "pending", joinedAt: "2024-06-15", balance: "$1,500", trades: 12 },
  { id: "10", name: "Nina Patel", email: "nina@example.com", role: "trader", status: "active", kycStatus: "verified", joinedAt: "2024-03-22", balance: "$5,600", trades: 89 },
]

const roleColors: Record<string, string> = {
  user: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  trader: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  provider: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

const kycColors: Record<string, string> = {
  verified: "text-emerald-600",
  pending: "text-amber-600",
  rejected: "text-red-600",
  not_submitted: "text-muted-foreground",
}

interface UserTableProps {
  onUserSelect?: (user: User) => void
}

export function UserTable({ onUserSelect }: UserTableProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")

  const filtered = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter
    return matchesSearch && matchesRole && matchesStatus && matchesKyc
  })

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => v != null && setRoleFilter(v)}>
          <SelectTrigger>
            <Filter className="size-3.5" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="trader">Trader</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => v != null && setStatusFilter(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kycFilter} onValueChange={(v) => v != null && setKycFilter(v)}>
          <SelectTrigger>
            <SelectValue placeholder="KYC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="not_submitted">Not Submitted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">Trades</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => onUserSelect?.(user)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px]">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", roleColors[user.role])}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[user.status])}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn("text-xs font-medium capitalize", kycColors[user.kycStatus])}>
                    {user.kycStatus.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{user.balance}</TableCell>
                <TableCell className="text-right text-muted-foreground">{user.trades}</TableCell>
                <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockUsers.length} users
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export type { User }
