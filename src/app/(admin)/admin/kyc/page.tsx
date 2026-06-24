import { KYCReviewPanel } from "@/components/admin/kyc-review-panel"

export default function AdminKYCPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Review</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve user identity verification submissions
        </p>
      </div>
      <KYCReviewPanel />
    </div>
  )
}
