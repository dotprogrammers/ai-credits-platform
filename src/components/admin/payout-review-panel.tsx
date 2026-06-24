"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PayoutRequest {
  id: string
  userName: string
  userEmail: string
  amount: string
  method: "bank_transfer" | "paypal" | "crypto"
  status: "pending" | "approved" | "rejected"
  requestedAt: string
  notes: string
}

const mockPayouts: PayoutRequest[] = [
  { id: "PAY-001", userName: "Lisa Park", userEmail: "lisa@example.com", amount: "$340", method: "paypal", status: "pending", requestedAt: "2024-06-15 10:00", notes: "Affiliate commission - May 2024" },
  { id: "PAY-002", userName: "Sarah Chen", userEmail: "sarah@example.com", amount: "$1,200", method: "bank_transfer", status: "pending", requestedAt: "2024-06-14 16:30", notes: "Trading profits withdrawal" },
  { id: "PAY-003", userName: "David Kim", userEmail: "david@example.com", amount: "$85", method: "crypto", status: "pending", requestedAt: "2024-06-14 12:00", notes: "Referral bonus" },
  { id: "PAY-004", userName: "Nina Patel", userEmail: "nina@example.com", amount: "$520", method: "paypal", status: "pending", requestedAt: "2024-06-13 18:45", notes: "Affiliate commission - May 2024" },
  { id: "PAY-005", userName: "Alex Rivera", userEmail: "alex@example.com", amount: "$200", method: "bank_transfer", status: "pending", requestedAt: "2024-06-13 09:15", notes: "Trading profits withdrawal" },
]

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  crypto: "Crypto",
}

export function PayoutReviewPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  const selected = mockPayouts.find((p) => p.id === selectedId)

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Payout List */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Pending Payouts ({mockPayouts.length})
          </h3>
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" />
            Awaiting Review
          </Badge>
        </div>
        {mockPayouts.map((payout) => (
          <button
            key={payout.id}
            onClick={() => setSelectedId(payout.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
              selectedId === payout.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            )}
          >
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {payout.userName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{payout.userName}</p>
              <p className="text-xs text-muted-foreground">
                {methodLabels[payout.method]}
              </p>
            </div>
            <span className="text-sm font-bold">{payout.amount}</span>
          </button>
        ))}
      </div>

      {/* Review Panel */}
      <div className="lg:col-span-3">
        {selected ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Payout Review
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {selected.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">User</p>
                  <p className="text-sm font-medium">{selected.userName}</p>
                  <p className="text-xs text-muted-foreground">{selected.userEmail}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold">{selected.amount}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Method</p>
                  <p className="text-sm font-medium">{methodLabels[selected.method]}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Requested</p>
                  <p className="text-sm font-medium">{selected.requestedAt}</p>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <p className="text-[10px] text-muted-foreground">Notes</p>
                <p className="text-sm">{selected.notes}</p>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add notes about this payout..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setSelectedId(null)
                    setAdminNotes("")
                  }}
                >
                  <CheckCircle className="size-3.5" />
                  Approve Payout
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-1.5"
                  onClick={() => {
                    setSelectedId(null)
                    setAdminNotes("")
                  }}
                >
                  <XCircle className="size-3.5" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <DollarSign className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Select a payout to review
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
