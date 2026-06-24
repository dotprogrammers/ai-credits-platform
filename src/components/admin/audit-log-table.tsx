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

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ipAddress: string
  severity: "info" | "warning" | "critical"
}

const mockLogs: AuditLog[] = [
  { id: "1", timestamp: "2024-06-15 14:30:22", user: "admin@aicredits.io", action: "user.suspended", resource: "user:4", details: "Suspended user Maria Santos for suspicious activity", ipAddress: "192.168.1.1", severity: "warning" },
  { id: "2", timestamp: "2024-06-15 14:25:10", user: "admin@aicredits.io", action: "kyc.approved", resource: "kyc:12", details: "Approved KYC for Alex Rivera", ipAddress: "192.168.1.1", severity: "info" },
  { id: "3", timestamp: "2024-06-15 13:45:00", user: "system", action: "trade.flagged", resource: "trade:TRD-005", details: "Trade flagged for manual review - amount exceeds threshold", ipAddress: "-", severity: "warning" },
  { id: "4", timestamp: "2024-06-15 12:00:00", user: "admin@aicredits.io", action: "settings.updated", resource: "settings:commissions", details: "Updated trade fee from 2.5% to 2.0%", ipAddress: "192.168.1.1", severity: "info" },
  { id: "5", timestamp: "2024-06-15 10:15:30", user: "system", action: "auth.failed", resource: "session", details: "Multiple failed login attempts for admin@aicredits.io", ipAddress: "10.0.0.55", severity: "critical" },
  { id: "6", timestamp: "2024-06-14 18:30:00", user: "admin@aicredits.io", action: "provider.created", resource: "provider:7", details: "Created new provider: ElevenLabs", ipAddress: "192.168.1.1", severity: "info" },
  { id: "7", timestamp: "2024-06-14 16:00:00", user: "admin@aicredits.io", action: "payout.approved", resource: "payout:23", details: "Approved payout of $340 for Lisa Park", ipAddress: "192.168.1.1", severity: "info" },
  { id: "8", timestamp: "2024-06-14 14:20:00", user: "system", action: "auction.ended", resource: "auction:AUC-003", details: "Auction ended - winner: David Kim, amount: $1,500", ipAddress: "-", severity: "info" },
]

const severityColors: Record<string, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function AuditLogTable() {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")

  const filtered = mockLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={severityFilter} onValueChange={(v) => v != null && setSeverityFilter(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Download className="size-3.5" />
          Export
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell className="text-sm">{log.user}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {log.action}
                  </code>
                </TableCell>
                <TableCell className="text-xs max-w-xs truncate">
                  {log.details}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.ipAddress}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", severityColors[log.severity])}>
                    {log.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {mockLogs.length} entries
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
