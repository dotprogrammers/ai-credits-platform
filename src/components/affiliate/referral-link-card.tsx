"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Link2 } from "lucide-react"

interface ReferralLinkCardProps {
  referralCode: string
}

export function ReferralLinkCard({ referralCode }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false)
  const referralLink = `https://aicredits.exchange/ref/${referralCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="size-4" />
          Your Referral Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Referral Code</Label>
          <div className="flex items-center gap-2">
            <Input value={referralCode} readOnly className="font-mono" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigator.clipboard.writeText(referralCode)}
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Referral Link</Label>
          <div className="flex items-center gap-2">
            <Input value={referralLink} readOnly className="font-mono text-xs" />
            <Button
              variant={copied ? "default" : "outline"}
              size="icon"
              onClick={handleCopy}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            Earn <span className="font-bold text-foreground">10% commission</span> on all trades made by users you refer. Commissions are paid instantly in USD.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
