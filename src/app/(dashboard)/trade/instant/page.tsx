import { PageHeader } from "@/components/shared/page-header"
import { InstantTradeForm } from "@/components/trading/instant-trade-form"

export default function InstantTradePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Instant Trade"
        description="Buy or sell credits instantly at the best market price."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade", href: "/trade" },
          { label: "Instant Trade" },
        ]}
      />
      <InstantTradeForm />
    </div>
  )
}
