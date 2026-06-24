import { PortfolioSummary } from "@/components/dashboard/portfolio-summary"
import { HoldingsTable } from "@/components/dashboard/holdings-table"
import { RecentTrades } from "@/components/dashboard/recent-trades"
import { QuickTradeWidget } from "@/components/dashboard/quick-trade-widget"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here&apos;s an overview of your portfolio and recent activity."
        actions={
          <div className="flex gap-2">
            <Link href="/wallet/deposit">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Deposit
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
        }
      />

      <PortfolioSummary />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HoldingsTable />
        </div>
        <div className="space-y-6">
          <QuickTradeWidget />
        </div>
      </div>

      <RecentTrades />
    </div>
  )
}
