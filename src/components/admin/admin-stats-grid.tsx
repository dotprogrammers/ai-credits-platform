"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Users,
  DollarSign,
  ArrowLeftRight,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

interface StatCard {
  label: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: LucideIcon
}

const stats: StatCard[] = [
  {
    label: "Total Users",
    value: "24,891",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
  },
  {
    label: "Trading Volume",
    value: "$1.42M",
    change: "+8.2%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    label: "Total Trades",
    value: "156,429",
    change: "+23.1%",
    changeType: "positive",
    icon: ArrowLeftRight,
  },
  {
    label: "Platform Revenue",
    value: "$89,240",
    change: "-2.4%",
    changeType: "negative",
    icon: TrendingUp,
  },
]

export function AdminStatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    stat.changeType === "positive" && "text-emerald-600",
                    stat.changeType === "negative" && "text-red-600",
                    stat.changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {stat.change} from last month
                </span>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
