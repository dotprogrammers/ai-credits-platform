"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Shield,
  Mail,
  Calendar,
  DollarSign,
  ArrowLeftRight,
  Ban,
  CheckCircle,
  AlertTriangle,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "./user-table"

interface UserDetailPanelProps {
  user: User
  onClose?: () => void
}

export function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const [newRole, setNewRole] = useState(user.role)

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("capitalize", statusColors[user.status])}>
          {user.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoItem icon={Mail} label="Email" value={user.email} />
          <InfoItem icon={Calendar} label="Joined" value={user.joinedAt} />
          <InfoItem icon={DollarSign} label="Balance" value={user.balance} />
          <InfoItem icon={ArrowLeftRight} label="Total Trades" value={String(user.trades)} />
        </div>

        <Separator />

        {/* KYC Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">KYC Status</span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "capitalize",
              user.kycStatus === "verified" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              user.kycStatus === "pending" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              user.kycStatus === "rejected" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {user.kycStatus.replace("_", " ")}
          </Badge>
        </div>

        <Separator />

        {/* Role Management */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserCog className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Role</span>
          </div>
          <Select value={newRole} onValueChange={(v) => v != null && setNewRole(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="trader">Trader</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {newRole !== user.role && (
            <Button size="sm" className="w-full">
              Update Role
            </Button>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {user.status === "active" ? (
            <Button variant="destructive" size="sm" className="w-full gap-1.5">
              <Ban className="size-3.5" />
              Suspend
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-1.5 text-emerald-600">
              <CheckCircle className="size-3.5" />
              Activate
            </Button>
          )}
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            <AlertTriangle className="size-3.5" />
            Warn
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border p-2">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs font-medium truncate">{value}</p>
      </div>
    </div>
  )
}
