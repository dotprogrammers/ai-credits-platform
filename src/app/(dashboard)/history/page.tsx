import { PageHeader } from "@/components/shared/page-header"
import { TradeHistoryTable } from "@/components/dashboard/trade-history-table"

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade History"
        description="View all your past trades and their details."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "History" },
        ]}
      />
      <TradeHistoryTable />
    </div>
  )
}
