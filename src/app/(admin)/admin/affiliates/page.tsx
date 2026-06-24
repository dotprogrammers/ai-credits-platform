"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Users, DollarSign, TrendingUp, Copy, Save } from "lucide-react"
import { cn } from "@/lib/utils"

const mockAffiliates = [
  { id: "1", name: "Lisa Park", email: "lisa@example.com", referrals: 45, earnings: "$2,340", tier: "gold", status: "active", joinedAt: "2024-01-15" },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", referrals: 120, earnings: "$6,800", tier: "platinum", status: "active", joinedAt: "2024-01-05" },
  { id: "3", name: "David Kim", email: "david@example.com", referrals: 12, earnings: "$480", tier: "bronze", status: "active", joinedAt: "2024-03-20" },
  { id: "4", name: "Nina Patel", email: "nina@example.com", referrals: 28, earnings: "$1,120", tier: "silver", status: "active", joinedAt: "2024-02-10" },
  { id: "5", name: "Alex Rivera", email: "alex@example.com", referrals: 5, earnings: "$150", tier: "bronze", status: "active", joinedAt: "2024-05-01" },
  { id: "6", name: "Ryan Lee", email: "ryan@example.com", referrals: 0, earnings: "$0", tier: "bronze", status: "inactive", joinedAt: "2024-06-01" },
]

const tierColors: Record<string, string> = {
  bronze: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  silver: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  platinum: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
}

export default function AdminAffiliatesPage() {
  const [search, setSearch] = useState("")

  const filtered = mockAffiliates.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Affiliates</h1>
        <p className="text-sm text-muted-foreground">
          Manage affiliate program and commission tiers
        </p>
      </div>

      <Tabs defaultValue="affiliates">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="tiers">Tier Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates" className="space-y-4">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">210</p>
                  <p className="text-xs text-muted-foreground">Total Affiliates</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$10,890</p>
                  <p className="text-xs text-muted-foreground">Total Paid Out</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8.4%</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search affiliates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Referrals</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{affiliate.name}</p>
                        <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize", tierColors[affiliate.tier])}>
                        {affiliate.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{affiliate.referrals}</TableCell>
                    <TableCell className="text-right font-semibold">{affiliate.earnings}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          affiliate.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        )}
                      >
                        {affiliate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{affiliate.joinedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { tier: "Bronze", minReferrals: "0", commission: "5%", color: tierColors.bronze },
                { tier: "Silver", minReferrals: "10", commission: "8%", color: tierColors.silver },
                { tier: "Gold", minReferrals: "25", commission: "12%", color: tierColors.gold },
                { tier: "Platinum", minReferrals: "50", commission: "15%", color: tierColors.platinum },
              ].map((t) => (
                <div key={t.tier} className="flex items-center gap-4 rounded-lg border p-4">
                  <Badge variant="outline" className={cn("capitalize", t.color)}>
                    {t.tier}
                  </Badge>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Min Referrals</Label>
                      <Input defaultValue={t.minReferrals} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Commission Rate</Label>
                      <Input defaultValue={t.commission} />
                    </div>
                  </div>
                </div>
              ))}
              <Button className="gap-1.5">
                <Save className="size-3.5" />
                Save Tier Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
