import { PageHeader } from "@/components/shared/page-header"
import { OrderBook } from "@/components/trading/order-book"
import { OrderForm } from "@/components/trading/order-form"
import { TradeHistoryChart } from "@/components/trading/trade-history-chart"
import { PriceChart } from "@/components/trading/price-chart"
import { SpreadIndicator } from "@/components/trading/spread-indicator"

export default function TradePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade"
        description="Buy and sell AI credits on the exchange."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade" },
        ]}
      />

      <SpreadIndicator
        spread={0.002}
        spreadPercent={4.76}
        lastPrice={0.042}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Order Book */}
        <div className="lg:col-span-1">
          <OrderBook productId="openai-gpt4" />
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-2">
          <PriceChart productId="openai-gpt4" />
          <div className="mt-4">
            <TradeHistoryChart />
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-1">
          <OrderForm />
        </div>
      </div>
    </div>
  )
}
