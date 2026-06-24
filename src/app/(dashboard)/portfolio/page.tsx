"use client"

import { PageHeader } from "@/components/shared/page-header"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const PNL_DATA = [
  { date: "Dec 1", pnl: 120 },
  { date: "Dec 3", pnl: -45 },
  { date: "Dec 5", pnl: 230 },
  { date: "Dec 7", pnl: 180 },
  { date: "Dec 9", pnl: -90 },
  { date: "Dec 11", pnl: 340 },
  { date: "Dec 13", pnl: 150 },
  { date: "Dec 15", pnl: 842 },
]

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Your holdings breakdown and performance metrics."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Portfolio" },
        ]}
      />

      <PortfolioSummary />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HoldingsTable />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>P&L History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PNL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`$${Number(value)}`, "P&L"]}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
