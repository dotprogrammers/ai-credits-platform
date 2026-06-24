import { PageHeader } from "@/components/shared/page-header"
import { ReferralLinkCard } from "@/components/affiliate/referral-link-card"
import { ReferralStats } from "@/components/affiliate/referral-stats"
import { CommissionChart } from "@/components/affiliate/commission-chart"
import { ReferralTable } from "@/components/affiliate/referral-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AffiliatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Affiliate Dashboard"
        description="Track your referrals, commissions, and payouts."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Affiliates" },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href="/affiliates/referrals">
              <Button variant="outline" size="sm">Referrals</Button>
            </Link>
            <Link href="/affiliates/commissions">
              <Button variant="outline" size="sm">Commissions</Button>
            </Link>
            <Link href="/affiliates/payouts">
              <Button variant="outline" size="sm">Payouts</Button>
            </Link>
          </div>
        }
      />

      <ReferralLinkCard referralCode="ALEX2024" />
      <ReferralStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CommissionChart />
        </div>
        <div>
          <ReferralTable />
        </div>
      </div>
    </div>
  )
}
