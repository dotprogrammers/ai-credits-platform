import { PageHeader } from "@/components/shared/page-header"
import { WithdrawalForm } from "@/components/dashboard/withdrawal-form"

export default function WithdrawPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdraw"
        description="Withdraw funds from your wallet."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Wallet", href: "/wallet" },
          { label: "Withdraw" },
        ]}
      />
      <WithdrawalForm />
    </div>
  )
}
