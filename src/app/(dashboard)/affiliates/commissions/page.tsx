import { PageHeader } from "@/components/shared/page-header"
import { CommissionChart } from "@/components/affiliate/commission-chart"
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

const COMMISSIONS = [
  { id: "com_001", referral: "John Smith", tradeId: "trd_045", amount: 42.00, status: "paid", date: "2024-12-15" },
  { id: "com_002", referral: "Sarah Johnson", tradeId: "trd_042", amount: 19.50, status: "paid", date: "2024-12-14" },
  { id: "com_003", referral: "Mike Chen", tradeId: "trd_038", amount: 75.20, status: "pending", date: "2024-12-13" },
  { id: "com_004", referral: "Alex Wilson", tradeId: "trd_035", amount: 124.80, status: "paid", date: "2024-12-12" },
  { id: "com_005", referral: "John Smith", tradeId: "trd_030", amount: 33.60, status: "paid", date: "2024-12-11" },
]

export default function CommissionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Commissions"
        description="Track your commission earnings from referred users."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Affiliates", href: "/affiliates" },
          { label: "Commissions" },
        ]}
      />

      <CommissionChart />

      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Referral</TableHead>
                <TableHead>Trade</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMMISSIONS.map((com) => (
                <TableRow key={com.id}>
                  <TableCell className="font-mono text-xs">{com.id}</TableCell>
                  <TableCell className="font-medium">{com.referral}</TableCell>
                  <TableCell className="font-mono text-xs">{com.tradeId}</TableCell>
                  <TableCell className="text-right font-mono font-medium text-emerald-500">
                    ${com.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={com.status === "paid" ? "default" : "secondary"}>
                      {com.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{com.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
