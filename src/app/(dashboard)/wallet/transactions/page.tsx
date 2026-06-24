import { PageHeader } from "@/components/shared/page-header"
import { TransactionTable } from "@/components/dashboard/transaction-table"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View your complete transaction history."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Wallet", href: "/wallet" },
          { label: "Transactions" },
        ]}
      />
      <TransactionTable />
    </div>
  )
}
