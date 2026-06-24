import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowDownRight, ArrowUpRight, Clock, Hash } from "lucide-react"

export default function TradeDetailPage() {
  const trade = {
    id: "trd_001",
    type: "buy" as const,
    product: "OpenAI GPT-4",
    quantity: 10000,
    price: 0.042,
    total: 420.00,
    fee: 1.68,
    status: "filled",
    orderType: "limit",
    createdAt: "2024-12-15 14:30:22",
    filledAt: "2024-12-15 14:30:25",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Trade ${trade.id}`}
        description="Detailed view of your trade."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "History", href: "/history" },
          { label: trade.id },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {trade.type === "buy" ? (
                    <ArrowDownRight className="size-5 text-emerald-500" />
                  ) : (
                    <ArrowUpRight className="size-5 text-red-500" />
                  )}
                  <span className={trade.type === "buy" ? "text-emerald-500" : "text-red-500"}>
                    {trade.type.toUpperCase()}
                  </span>
                  <span>{trade.product}</span>
                </CardTitle>
                <Badge>{trade.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-lg font-bold font-mono">{trade.quantity.toLocaleString()} credits</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Price per Credit</p>
                  <p className="text-lg font-bold font-mono">${trade.price.toFixed(4)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold font-mono">${trade.total.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Fee (0.4%)</p>
                  <p className="text-lg font-bold font-mono">${trade.fee.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Hash className="size-3" /> Trade ID
              </span>
              <span className="font-mono text-xs">{trade.id}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Order Type</span>
              <span className="capitalize">{trade.orderType}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3" /> Created
              </span>
              <span className="text-xs">{trade.createdAt}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3" /> Filled
              </span>
              <span className="text-xs">{trade.filledAt}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
