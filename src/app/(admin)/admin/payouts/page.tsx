import { PayoutReviewPanel } from "@/components/admin/payout-review-panel"

export default function AdminPayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve withdrawal requests
        </p>
      </div>
      <PayoutReviewPanel />
    </div>
  )
}
