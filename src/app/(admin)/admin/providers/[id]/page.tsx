"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Plus, Edit, Trash2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProviderForm } from "@/components/admin/provider-form"
import Link from "next/link"

const mockProvider = {
  id: "1",
  name: "OpenAI",
  category: "LLM",
  status: "active",
  description: "Leading AI research company behind GPT models",
  website: "https://openai.com",
  apiEndpoint: "https://api.openai.com/v1",
}

const mockProducts = [
  { id: "1", name: "GPT-4o", type: "chat", pricePerCredit: "$0.0025", status: "active" },
  { id: "2", name: "GPT-4o Mini", type: "chat", pricePerCredit: "$0.0005", status: "active" },
  { id: "3", name: "GPT-4 Turbo", type: "chat", pricePerCredit: "$0.01", status: "active" },
  { id: "4", name: "DALL-E 3", type: "image", pricePerCredit: "$0.04", status: "active" },
  { id: "5", name: "Whisper", type: "audio", pricePerCredit: "$0.006", status: "active" },
  { id: "6", name: "TTS", type: "audio", pricePerCredit: "$0.015", status: "inactive" },
]

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" render={<Link href="/admin/providers" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{mockProvider.name}</h1>
          <p className="text-sm text-muted-foreground">{mockProvider.description}</p>
        </div>
      </div>

      {/* Provider Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="text-lg font-semibold">{mockProvider.category}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant="outline" className="mt-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {mockProvider.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">API Endpoint</p>
            <p className="text-sm font-mono truncate">{mockProvider.apiEndpoint}</p>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Products ({mockProducts.length})</CardTitle>
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger>
              <Button size="sm" className="gap-1.5">
                <Plus className="size-3.5" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="e.g., GPT-4o" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">Chat / Completion</SelectItem>
                      <SelectItem value="image">Image Generation</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="embedding">Embedding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price per Credit</Label>
                  <Input placeholder="$0.0025" />
                </div>
                <Button className="w-full gap-1.5">
                  <Save className="size-3.5" />
                  Create Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price/Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-sm font-medium">{product.name}</TableCell>
                    <TableCell className="text-sm capitalize">{product.type}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{product.pricePerCredit}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          product.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        )}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-xs">
                          <Edit className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" className="text-red-600">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
