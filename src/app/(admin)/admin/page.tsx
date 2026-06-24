import { AdminStatsGrid } from "@/components/admin/admin-stats-grid"
import { AdminDashboardCharts } from "./charts"
import { AdminRecentActivity } from "./recent-activity"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      <AdminStatsGrid />
      <AdminDashboardCharts />
      <AdminRecentActivity />
    </div>
  )
}
