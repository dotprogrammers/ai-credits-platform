"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KYCSubmission {
  id: string
  userName: string
  userEmail: string
  submittedAt: string
  documentType: "passport" | "drivers_license" | "national_id"
  status: "pending" | "approved" | "rejected"
  riskLevel: "low" | "medium" | "high"
}

const mockSubmissions: KYCSubmission[] = [
  { id: "1", userName: "Alex Rivera", userEmail: "alex@example.com", submittedAt: "2024-06-15 14:30", documentType: "passport", status: "pending", riskLevel: "low" },
  { id: "2", userName: "Tom Brown", userEmail: "tom@example.com", submittedAt: "2024-06-15 12:15", documentType: "drivers_license", status: "pending", riskLevel: "medium" },
  { id: "3", userName: "Ryan Lee", userEmail: "ryan@example.com", submittedAt: "2024-06-14 18:45", documentType: "national_id", status: "pending", riskLevel: "low" },
  { id: "4", userName: "Sophie Turner", userEmail: "sophie@example.com", submittedAt: "2024-06-14 09:20", documentType: "passport", status: "pending", riskLevel: "high" },
  { id: "5", userName: "Marcus Johnson", userEmail: "marcus@example.com", submittedAt: "2024-06-13 16:00", documentType: "passport", status: "pending", riskLevel: "low" },
]

const riskColors: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export function KYCReviewPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const selected = mockSubmissions.find((s) => s.id === selectedId)

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Queue List */}
      <div className="lg:col-span-2 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Pending Reviews ({mockSubmissions.length})
          </h3>
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" />
            Queue
          </Badge>
        </div>
        {mockSubmissions.map((submission) => (
          <button
            key={submission.id}
            onClick={() => setSelectedId(submission.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
              selectedId === submission.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            )}
          >
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {submission.userName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{submission.userName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {submission.documentType.replace("_", " ")}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("text-[10px]", riskColors[submission.riskLevel])}
            >
              {submission.riskLevel}
            </Badge>
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
                  <FileText className="size-4" />
                  KYC Review
                </CardTitle>
                <Badge variant="outline" className={cn(riskColors[selected.riskLevel])}>
                  {selected.riskLevel} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{selected.userName}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selected.userEmail}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Document Type</p>
                  <p className="text-sm font-medium capitalize">
                    {selected.documentType.replace("_", " ")}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-[10px] text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">{selected.submittedAt}</p>
                </div>
              </div>

              {/* Document Preview Placeholder */}
              <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                <div className="text-center">
                  <Eye className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Document preview would appear here
                  </p>
                </div>
              </div>

              {/* Risk Indicators */}
              {selected.riskLevel === "high" && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                  <AlertTriangle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-700 dark:text-red-400">
                      High Risk Indicator
                    </p>
                    <p className="text-[11px] text-red-600 dark:text-red-400/80">
                      Document appears to have inconsistencies. Manual verification recommended.
                    </p>
                  </div>
                </div>
              )}

              {/* Reject Reason */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Rejection Reason (if rejecting)</label>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setSelectedId(null)
                    setRejectReason("")
                  }}
                >
                  <CheckCircle className="size-3.5" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-1.5"
                  disabled={!rejectReason.trim()}
                  onClick={() => {
                    setSelectedId(null)
                    setRejectReason("")
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
              <FileText className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Select a submission to review
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
