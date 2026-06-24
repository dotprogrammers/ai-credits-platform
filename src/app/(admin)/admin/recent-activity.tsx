"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "trade",
    user: "Sarah Chen",
    initials: "SC",
    action: "completed a trade",
    detail: "GPT-4 Credits -> Claude Credits",
    amount: "$2,400",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "kyc",
    user: "Alex Rivera",
    initials: "AR",
    action: "submitted KYC verification",
    detail: "Passport upload",
    amount: null,
    time: "5 min ago",
  },
  {
    id: 3,
    type: "signup",
    user: "James Wilson",
    initials: "JW",
    action: "registered new account",
    detail: "Via Google OAuth",
    amount: null,
    time: "12 min ago",
  },
  {
    id: 4,
    type: "trade",
    user: "Maria Santos",
    initials: "MS",
    action: "placed a limit order",
    detail: "Buy 500 Gemini Credits @ $0.85",
    amount: "$425",
    time: "18 min ago",
  },
  {
    id: 5,
    type: "auction",
    user: "David Kim",
    initials: "DK",
    action: "won an auction",
    detail: "1000 OpenAI Credits (bulk)",
    amount: "$1,200",
    time: "25 min ago",
  },
  {
    id: 6,
    type: "payout",
    user: "Lisa Park",
    initials: "LP",
    action: "requested payout",
    detail: "Affiliate commission withdrawal",
    amount: "$340",
    time: "32 min ago",
  },
]

const typeColors: Record<string, string> = {
  trade: "bg-blue-500/10 text-blue-600",
  kyc: "bg-amber-500/10 text-amber-600",
  signup: "bg-emerald-500/10 text-emerald-600",
  auction: "bg-purple-500/10 text-purple-600",
  payout: "bg-rose-500/10 text-rose-600",
}

export function AdminRecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <Avatar size="sm">
                <AvatarFallback className="text-[10px]">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.detail}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {activity.amount && (
                  <span className="text-sm font-semibold">{activity.amount}</span>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] ${typeColors[activity.type] || ""}`}
                >
                  {activity.type}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
