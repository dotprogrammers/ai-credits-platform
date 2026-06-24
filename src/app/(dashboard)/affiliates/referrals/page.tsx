import { PageHeader } from "@/components/shared/page-header"
import { ReferralTable } from "@/components/affiliate/referral-table"

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="View all users you have referred to the platform."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Affiliates", href: "/affiliates" },
          { label: "Referrals" },
        ]}
      />
      <ReferralTable />
    </div>
  )
}
