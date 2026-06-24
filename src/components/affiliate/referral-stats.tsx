"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, TrendingUp, Award } from "lucide-react"

interface ReferralStatsProps {
  totalReferrals: number
  activeReferrals: number
  totalCommission: number
  pendingCommission: number
}

export function ReferralStats({
  totalReferrals = 47,
  activeReferrals = 32,
  totalCommission = 2847.50,
  pendingCommission = 142.30,
}: Partial<ReferralStatsProps>) {
  const stats = [
    {
      title: "Total Referrals",
      value: totalReferrals.toString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Referrals",
      value: activeReferrals.toString(),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Commission",
      value: `$${totalCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Pending",
      value: `$${pendingCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: Award,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
