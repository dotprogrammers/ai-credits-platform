"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const PRICE_DATA = Array.from({ length: 50 }, (_, i) => ({
  time: new Date(Date.now() - (49 - i) * 3600000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  price: 0.040 + Math.sin(i / 5) * 0.003 + Math.random() * 0.002,
  volume: Math.floor(Math.random() * 50000) + 10000,
}))

interface PriceChartProps {
  productId?: string
  className?: string
}

export function PriceChart({ className }: PriceChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Price Chart</CardTitle>
          <div className="flex gap-1">
            {["1H", "4H", "1D", "1W", "1M"].map((tf) => (
              <button
                key={tf}
                className="rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PRICE_DATA}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={["dataMin - 0.001", "dataMax + 0.001"]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v.toFixed(3)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`$${Number(value).toFixed(4)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                fill="url(#priceGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
