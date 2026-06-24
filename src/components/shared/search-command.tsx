"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Wallet,
  ArrowLeftRight,
  History,
  Users,
  Settings,
  Gavel,
  FileText,
} from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface SearchItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  keywords?: string[]
}

const SEARCH_ITEMS: SearchItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, keywords: ["home", "overview"] },
  { title: "Portfolio", href: "/portfolio", icon: Briefcase, keywords: ["holdings", "assets"] },
  { title: "Wallet", href: "/wallet", icon: Wallet, keywords: ["balance", "funds"] },
  { title: "Deposit", href: "/wallet/deposit", icon: Wallet, keywords: ["add funds", "top up"] },
  { title: "Withdraw", href: "/wallet/withdraw", icon: Wallet, keywords: ["withdraw", "cash out"] },
  { title: "Transactions", href: "/wallet/transactions", icon: FileText, keywords: ["history", "ledger"] },
  { title: "Trade", href: "/trade", icon: ArrowLeftRight, keywords: ["exchange", "buy", "sell"] },
  { title: "Order Book", href: "/trade/order-book", icon: FileText, keywords: ["depth", "orders"] },
  { title: "Instant Trade", href: "/trade/instant", icon: ArrowLeftRight, keywords: ["quick", "instant"] },
  { title: "Auctions", href: "/trade/auctions", icon: Gavel, keywords: ["bid", "auction"] },
  { title: "Trade History", href: "/history", icon: History, keywords: ["past trades", "log"] },
  { title: "Affiliates", href: "/affiliates", icon: Users, keywords: ["referral", "commission"] },
  { title: "Notifications", href: "/notifications", icon: FileText, keywords: ["alerts", "messages"] },
  { title: "Settings", href: "/settings", icon: Settings, keywords: ["profile", "preferences"] },
  { title: "Security", href: "/settings/security", icon: Settings, keywords: ["2fa", "password"] },
  { title: "API Keys", href: "/settings/api-keys", icon: Settings, keywords: ["api", "tokens"] },
  { title: "KYC", href: "/settings/kyc", icon: Settings, keywords: ["verification", "identity"] },
]

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex h-8 w-full items-center rounded-lg border border-input bg-muted/50 px-3 text-sm text-muted-foreground shadow-sm hover:bg-muted/80 sm:w-64"
      >
        <Search className="mr-2 size-3.5" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search pages and actions..."
      >
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {SEARCH_ITEMS.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => handleSelect(item.href)}
                  className="gap-3"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={() => handleSelect("/wallet/deposit")}
                className="gap-3"
              >
                <Wallet className="size-4 text-muted-foreground" />
                <span>Deposit Funds</span>
              </CommandItem>
              <CommandItem
                onSelect={() => handleSelect("/trade")}
                className="gap-3"
              >
                <ArrowLeftRight className="size-4 text-muted-foreground" />
                <span>Start Trading</span>
              </CommandItem>
              <CommandItem
                onSelect={() => handleSelect("/trade/auctions")}
                className="gap-3"
              >
                <Gavel className="size-4 text-muted-foreground" />
                <span>Browse Auctions</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
