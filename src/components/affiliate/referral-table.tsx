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

const REFERRALS = [
  { id: "ref_001", name: "John Smith", email: "john@example.com", joinedAt: "2024-11-15", status: "active", trades: 23, commission: 142.50 },
  { id: "ref_002", name: "Sarah Johnson", email: "sarah@example.com", joinedAt: "2024-11-02", status: "active", trades: 15, commission: 89.30 },
  { id: "ref_003", name: "Mike Chen", email: "mike@example.com", joinedAt: "2024-10-20", status: "active", trades: 42, commission: 312.80 },
  { id: "ref_004", name: "Emily Davis", email: "emily@example.com", joinedAt: "2024-10-05", status: "inactive", trades: 3, commission: 12.40 },
  { id: "ref_005", name: "Alex Wilson", email: "alex.w@example.com", joinedAt: "2024-09-18", status: "active", trades: 67, commission: 524.10 },
  { id: "ref_006", name: "Lisa Brown", email: "lisa@example.com", joinedAt: "2024-09-01", status: "active", trades: 8, commission: 45.20 },
]

export function ReferralTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Trades</TableHead>
              <TableHead className="text-right">Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {REFERRALS.map((ref) => (
              <TableRow key={ref.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">{ref.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{ref.joinedAt}</TableCell>
                <TableCell>
                  <Badge variant={ref.status === "active" ? "default" : "secondary"}>
                    {ref.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{ref.trades}</TableCell>
                <TableCell className="text-right font-mono font-medium text-emerald-500">
                  ${ref.commission.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
