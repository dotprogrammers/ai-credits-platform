import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, FileText, User } from "lucide-react"

export default function KycPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Verification"
        description="Verify your identity to unlock all platform features."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "KYC" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification Status</CardTitle>
                <Badge className="bg-emerald-500">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Personal Information", status: "verified" as const, icon: User },
                  { label: "Identity Document", status: "verified" as const, icon: FileText },
                  { label: "Address Verification", status: "verified" as const, icon: ShieldCheck },
                ].map((step, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10">
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className="text-xs text-muted-foreground">Verified on Dec 1, 2024</p>
                        </div>
                      </div>
                      <Badge variant="default">Verified</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Daily Deposit Limit</p>
                  <p className="text-lg font-bold">$50,000</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Daily Withdrawal Limit</p>
                  <p className="text-lg font-bold">$25,000</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Trading Limit</p>
                  <p className="text-lg font-bold">Unlimited</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Benefits of Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Higher deposit and withdrawal limits",
              "Access to all trading pairs",
              "Faster withdrawal processing",
              "Eligibility for affiliate program",
              "Priority customer support",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
