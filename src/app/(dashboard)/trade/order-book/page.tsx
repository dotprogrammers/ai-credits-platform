import { PageHeader } from "@/components/shared/page-header"
import { OrderBook } from "@/components/trading/order-book"

export default function OrderBookPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Book"
        description="Full order book depth view for OpenAI GPT-4 credits."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade", href: "/trade" },
          { label: "Order Book" },
        ]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <OrderBook productId="openai-gpt4" />
        <OrderBook productId="anthropic-claude" />
      </div>
    </div>
  )
}
