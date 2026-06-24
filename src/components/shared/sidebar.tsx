"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  ArrowLeftRight,
  History,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gavel,
  Shield,
  Key,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string; icon?: React.ComponentType<{ className?: string }> }[]
}

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Portfolio", href: "/portfolio", icon: Briefcase },
  {
    title: "Wallet",
    href: "/wallet",
    icon: Wallet,
    children: [
      { title: "Overview", href: "/wallet" },
      { title: "Deposit", href: "/wallet/deposit" },
      { title: "Withdraw", href: "/wallet/withdraw" },
      { title: "Transactions", href: "/wallet/transactions" },
    ],
  },
  {
    title: "Trade",
    href: "/trade",
    icon: ArrowLeftRight,
    children: [
      { title: "Exchange", href: "/trade" },
      { title: "Order Book", href: "/trade/order-book" },
      { title: "Instant Trade", href: "/trade/instant" },
      { title: "Auctions", href: "/trade/auctions" },
      { title: "Create Auction", href: "/trade/auctions/create" },
    ],
  },
  { title: "History", href: "/history", icon: History },
  {
    title: "Affiliates",
    href: "/affiliates",
    icon: Users,
    children: [
      { title: "Overview", href: "/affiliates" },
      { title: "Referrals", href: "/affiliates/referrals" },
      { title: "Commissions", href: "/affiliates/commissions" },
      { title: "Payouts", href: "/affiliates/payouts" },
    ],
  },
  { title: "Notifications", href: "/notifications", icon: Bell },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { title: "Profile", href: "/settings" },
      { title: "Security", href: "/settings/security", icon: Shield },
      { title: "API Keys", href: "/settings/api-keys", icon: Key },
      { title: "KYC", href: "/settings/kyc", icon: UserCheck },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      return next
    })
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider delay={300}>
      <aside
        className={cn(
          "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">
              AI Credits Exchange
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => {
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.has(item.href)
            const active = isActive(item.href)

            const trigger = (
              <button
                key={item.href}
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.href)
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {hasChildren && (
                      <ChevronRight
                        className={cn(
                          "size-3.5 transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    )}
                  </>
                )}
              </button>
            )

            return (
              <div key={item.href}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger render={trigger} />
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : hasChildren ? (
                  <>
                    {trigger}
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l pl-3">
                        {item.children!.map((child) => {
                          const childActive = pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors",
                                childActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              )}
                            >
                              {child.icon && <child.icon className="size-3" />}
                              {child.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href}>{trigger}</Link>
                )}
              </div>
            )
          })}
        </nav>

        <Separator />

        {/* Collapse Toggle */}
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <>
                <ChevronLeft className="size-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
