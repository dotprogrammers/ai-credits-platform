import { PageHeader } from "@/components/shared/page-header"
import { PayoutRequestForm } from "@/components/affiliate/payout-request-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const PAYOUTS = [
  { id: "pay_001", amount: 500.00, method: "USDC", status: "completed", date: "2024-12-01" },
  { id: "pay_002", amount: 320.00, method: "Account Balance", status: "completed", date: "2024-11-15" },
  { id: "pay_003", amount: 180.00, method: "Wire Transfer", status: "pending", date: "2024-12-14" },
]

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payouts"
        description="Request and track your commission payouts."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Affiliates", href: "/affiliates" },
          { label: "Payouts" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PayoutRequestForm />

        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PAYOUTS.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${payout.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <Badge variant={payout.status === "completed" ? "default" : "secondary"}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{payout.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
