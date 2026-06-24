"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { Bell, Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, string> = {
  trade: "📈",
  order: "📋",
  system: "⚙️",
  auction: "🔨",
  affiliate: "💰",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Notifications" },
        ]}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 size-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="mb-4 size-12 text-muted-foreground" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up!
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-muted/50",
                !notification.read && "border-l-2 border-l-primary"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <span className="text-2xl">{typeIcons[notification.type] || "📌"}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="outline" className="text-[10px]">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</p>
                </div>
                {!notification.read && (
                  <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id) }}>
                    <Check className="size-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
