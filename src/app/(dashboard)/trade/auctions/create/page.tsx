"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateAuctionPage() {
  const [title, setTitle] = useState("")
  const [product, setProduct] = useState("")
  const [credits, setCredits] = useState("")
  const [startingPrice, setStartingPrice] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Auction"
        description="List your AI credits for auction."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade", href: "/trade" },
          { label: "Auctions", href: "/trade/auctions" },
          { label: "Create Auction" },
        ]}
      />

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Auction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="e.g., Premium GPT-4 Credits Bundle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe what you're auctioning..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={product} onValueChange={(v) => setProduct(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai-gpt4">OpenAI GPT-4</SelectItem>
                  <SelectItem value="anthropic-claude">Anthropic Claude</SelectItem>
                  <SelectItem value="google-gemini">Google Gemini</SelectItem>
                  <SelectItem value="meta-llama">Meta Llama</SelectItem>
                  <SelectItem value="midjourney-v6">Midjourney v6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Credit Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 100000"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Starting Price (USD per credit)</Label>
              <Input
                type="number"
                placeholder="0.0000"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                step="0.0001"
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={(v) => setDuration(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="12h">12 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="48h">48 Hours</SelectItem>
                  <SelectItem value="72h">72 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              A 2% listing fee will be charged upon auction creation. The fee is refunded if the auction doesn&apos;t receive any bids.
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!title || !product || !credits || !startingPrice || !duration}
          >
            Create Auction
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
