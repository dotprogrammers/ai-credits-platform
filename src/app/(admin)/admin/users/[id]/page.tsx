"use client"

import { UserDetailPanel } from "@/components/admin/user-detail-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock user data for the detail page
const mockUser = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah@example.com",
  role: "trader" as const,
  status: "active" as const,
  kycStatus: "verified" as const,
  joinedAt: "2024-01-15",
  balance: "$12,400",
  trades: 156,
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" render={<Link href="/admin/users" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
          <p className="text-sm text-muted-foreground">
            View and manage user account
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UserDetailPanel user={mockUser} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          {/* Recent Trades */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4">Recent Trades</h3>
              <div className="space-y-2">
                {[
                  { pair: "GPT-4 -> Claude", amount: "$2,400", date: "2024-06-15", status: "completed" },
                  { pair: "Gemini -> GPT-4", amount: "$1,800", date: "2024-06-14", status: "completed" },
                  { pair: "Claude -> Mistral", amount: "$950", date: "2024-06-12", status: "completed" },
                ].map((trade, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-2">
                    <span className="text-sm font-medium">{trade.pair}</span>
                    <span className="text-sm text-muted-foreground">{trade.date}</span>
                    <span className="text-sm font-semibold">{trade.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4">Account Activity</h3>
              <div className="space-y-3">
                {[
                  { action: "Logged in from new device", time: "2 hours ago", type: "security" },
                  { action: "Changed email notification preferences", time: "1 day ago", type: "settings" },
                  { action: "Completed KYC verification", time: "3 days ago", type: "kyc" },
                  { action: "Deposited $5,000 via wire transfer", time: "1 week ago", type: "finance" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="size-2 rounded-full bg-primary/50" />
                    <span className="flex-1">{activity.action}</span>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
