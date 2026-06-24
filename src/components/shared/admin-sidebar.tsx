"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  ShoppingCart,
  Gavel,
  Cpu,
  FileText,
  FolderTree,
  Globe,
  Settings,
  Percent,
  ToggleLeft,
  UserPlus,
  Wallet,
  ScrollText,
  ChevronDown,
  CreditCard,
  LogOut,
} from "lucide-react"
import { useState } from "react"

interface SidebarSection {
  title: string
  items: {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }[]
}

const sections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "KYC Review", href: "/admin/kyc", icon: ShieldCheck, badge: "12" },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { label: "Trades", href: "/admin/trades", icon: ArrowLeftRight },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Auctions", href: "/admin/auctions", icon: Gavel },
      { label: "Providers", href: "/admin/providers", icon: Cpu },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/content/blog", icon: FileText },
      { label: "Categories", href: "/admin/content/categories", icon: FolderTree },
      { label: "Landing Page", href: "/admin/content/landing", icon: Globe },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Affiliates", href: "/admin/affiliates", icon: UserPlus },
      { label: "Payouts", href: "/admin/payouts", icon: Wallet, badge: "5" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "General", href: "/admin/settings", icon: Settings },
      { label: "Commissions", href: "/admin/settings/commissions", icon: Percent },
      { label: "Feature Flags", href: "/admin/settings/features", icon: ToggleLeft },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    ],
  },
]

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.title, true]))
  )

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r bg-card text-card-foreground",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <CreditCard className="size-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">AI Credits</span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {sections.map((section) => (
          <div key={section.title} className="mb-1">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {section.title}
              <ChevronDown
                className={cn(
                  "size-3 transition-transform",
                  expandedSections[section.title] && "rotate-180"
                )}
              />
            </button>
            {expandedSections[section.title] && (
              <div className="mt-0.5 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Admin User</p>
            <p className="text-[10px] text-muted-foreground truncate">admin@aicredits.io</p>
          </div>
          <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
