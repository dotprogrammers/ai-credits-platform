"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  Menu,
  Shield,
} from "lucide-react"
import { useState } from "react"

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="size-4" />
      </Button>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users, trades, orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1 font-medium">
          <Shield className="size-3" />
          Admin
        </Badge>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            3
          </span>
        </Button>
      </div>
    </header>
  )
}
