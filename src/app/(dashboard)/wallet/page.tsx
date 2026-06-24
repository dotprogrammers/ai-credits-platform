import { PageHeader } from "@/components/shared/page-header"
import { WalletOverview } from "@/components/dashboard/wallet-overview"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, History } from "lucide-react"
import Link from "next/link"

function WalletActionCard({ href, icon: Icon, iconColor, iconBg, title, description }: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  title: string
  description: string
}) {
  return (
    <Link href={href} className="block">
      <Card className="cursor-pointer transition-shadow hover:shadow-md h-full">
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`rounded-lg p-3 ${iconBg}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet"
        description="Manage your funds and view your balance."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Wallet" },
        ]}
      />

      <WalletOverview />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WalletActionCard
          href="/wallet/deposit"
          icon={ArrowDownToLine}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          title="Deposit"
          description="Add funds to your account"
        />
        <WalletActionCard
          href="/wallet/withdraw"
          icon={ArrowUpFromLine}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
          title="Withdraw"
          description="Withdraw funds from your account"
        />
        <WalletActionCard
          href="/trade"
          icon={ArrowLeftRight}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          title="Trade"
          description="Buy and sell AI credits"
        />
        <WalletActionCard
          href="/wallet/transactions"
          icon={History}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          title="Transactions"
          description="View transaction history"
        />
      </div>
    </div>
  )
}
