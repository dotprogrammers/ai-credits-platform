"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, Eye, Edit, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderForm } from "@/components/admin/provider-form"
import Link from "next/link"

const mockProviders = [
  { id: "1", name: "OpenAI", category: "LLM", status: "active", products: 12, volume: "$420K" },
  { id: "2", name: "Anthropic", category: "LLM", status: "active", products: 8, volume: "$380K" },
  { id: "3", name: "Google AI", category: "Multimodal", status: "active", products: 15, volume: "$290K" },
  { id: "4", name: "Mistral", category: "LLM", status: "active", products: 6, volume: "$180K" },
  { id: "5", name: "Cohere", category: "Embeddings", status: "active", products: 4, volume: "$95K" },
  { id: "6", name: "Stability AI", category: "Image", status: "inactive", products: 5, volume: "$60K" },
  { id: "7", name: "ElevenLabs", category: "Audio", status: "maintenance", products: 3, volume: "$45K" },
]

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

export default function AdminProvidersPage() {
  const [search, setSearch] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filtered = mockProviders.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Providers</h1>
          <p className="text-sm text-muted-foreground">
            Manage AI service providers and their products
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Provider</DialogTitle>
            </DialogHeader>
            <ProviderForm onSubmit={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-xs font-bold">
                      {provider.name[0]}
                    </div>
                    <span className="text-sm font-medium">{provider.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{provider.category}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusColors[provider.status])}>
                    {provider.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{provider.products}</TableCell>
                <TableCell className="text-right font-medium">{provider.volume}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-xs" render={<Link href={`/admin/providers/${provider.id}`} />}>
                      <Eye className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-xs">
                      <Edit className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
