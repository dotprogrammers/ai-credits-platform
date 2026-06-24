"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function AdminDashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="7d">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              <TabsList>
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="24h" className="mt-4">
              <VolumeChart period="24h" />
            </TabsContent>
            <TabsContent value="7d" className="mt-4">
              <VolumeChart period="7d" />
            </TabsContent>
            <TabsContent value="30d" className="mt-4">
              <VolumeChart period="30d" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RevenueBar label="Trade Fees" value={42500} total={89240} color="bg-primary" />
            <RevenueBar label="Listing Fees" value={18200} total={89240} color="bg-emerald-500" />
            <RevenueBar label="Premium Subs" value={15840} total={89240} color="bg-blue-500" />
            <RevenueBar label="Auction Fees" value={8400} total={89240} color="bg-amber-500" />
            <RevenueBar label="API Access" value={4300} total={89240} color="bg-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-40">
            {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "OpenAI", volume: "$420K", trades: "12.4K" },
              { name: "Anthropic", volume: "$380K", trades: "10.8K" },
              { name: "Google AI", volume: "$290K", trades: "8.2K" },
              { name: "Mistral", volume: "$180K", trades: "5.6K" },
              { name: "Cohere", volume: "$95K", trades: "3.1K" },
            ].map((provider) => (
              <div key={provider.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-bold">
                    {provider.name[0]}
                  </div>
                  <span className="text-sm font-medium">{provider.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{provider.volume}</p>
                  <p className="text-[10px] text-muted-foreground">{provider.trades} trades</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function VolumeChart({ period }: { period: string }) {
  const data =
    period === "24h"
      ? [30, 45, 35, 60, 50, 70, 55, 80, 65, 75, 90, 85]
      : period === "7d"
        ? [50, 65, 45, 80, 60, 70, 90]
        : [40, 55, 45, 60, 50, 70, 65, 80, 75, 90, 85, 95, 70, 80]

  const max = Math.max(...data)

  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-primary/20 transition-all hover:bg-primary/40"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function RevenueBar({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const pct = (value / total) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          ${(value / 1000).toFixed(1)}K
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
