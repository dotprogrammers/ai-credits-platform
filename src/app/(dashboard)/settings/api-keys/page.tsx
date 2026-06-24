"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react"

const API_KEYS = [
  { id: "key_001", name: "Production API", prefix: "ak_live_7x3k...", createdAt: "2024-11-01", lastUsed: "2 hours ago", status: "active" },
  { id: "key_002", name: "Development", prefix: "ak_test_9m2p...", createdAt: "2024-10-15", lastUsed: "1 day ago", status: "active" },
  { id: "key_003", name: "Trading Bot", prefix: "ak_live_4h8n...", createdAt: "2024-09-20", lastUsed: "3 days ago", status: "revoked" },
]

export default function ApiKeysPage() {
  const [keyName, setKeyName] = useState("")
  const [showKey, setShowKey] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your API keys for programmatic access."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "API Keys" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your API Keys</CardTitle>
              <Dialog>
                <DialogTrigger>
                  <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    Create Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Key Name</Label>
                      <Input
                        placeholder="e.g., Production API"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                      />
                    </div>
                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        Make sure to copy your API key now. You won&apos;t be able to see it again.
                      </p>
                    </div>
                    <Button className="w-full" disabled={!keyName}>
                      Generate API Key
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {API_KEYS.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {showKey === key.id ? "ak_live_full_key_shown_here" : key.prefix}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{key.createdAt}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{key.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={key.status === "active" ? "default" : "destructive"}>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                          >
                            {showKey === key.id ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                          </Button>
                          <Button variant="ghost" size="icon-xs">
                            <Copy className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon-xs">
                            <Trash2 className="size-3 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">API Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Use our REST API to integrate AI Credits Trading into your applications.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium">Base URL</p>
              <code className="block rounded bg-muted p-2 text-xs font-mono">
                https://api.aicredits.exchange/v1
              </code>
            </div>
            <Button variant="outline" className="w-full" size="sm">
              View Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
