import { PageHeader } from "@/components/shared/page-header"
import { DepositForm } from "@/components/dashboard/deposit-form"

export default function DepositPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit"
        description="Add funds to your wallet."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Wallet", href: "/wallet" },
          { label: "Deposit" },
        ]}
      />
      <DepositForm />
    </div>
  )
}
