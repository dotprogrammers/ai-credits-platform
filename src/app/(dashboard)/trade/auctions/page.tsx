"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { AuctionCard } from "@/components/trading/auction-card"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Auction } from "@/hooks/use-auction"

const MOCK_AUCTIONS: Auction[] = [
  {
    id: "auc_001",
    title: "Premium GPT-4 Credits Bundle",
    description: "500,000 GPT-4 credits at a discounted rate.",
    productId: "openai-gpt4",
    productName: "OpenAI GPT-4",
    creditAmount: 500000,
    startingPrice: 0.035,
    currentBid: 0.039,
    bidCount: 12,
    endsAt: new Date(Date.now() + 3600000 * 4).toISOString(),
    status: "active",
    createdBy: "usr_def456",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "auc_002",
    title: "Claude Credits Mega Pack",
    description: "1,000,000 Claude credits for enterprise use.",
    productId: "anthropic-claude",
    productName: "Anthropic Claude",
    creditAmount: 1000000,
    startingPrice: 0.030,
    currentBid: 0.034,
    bidCount: 8,
    endsAt: new Date(Date.now() + 3600000 * 12).toISOString(),
    status: "active",
    createdBy: "usr_ghi789",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "auc_003",
    title: "Gemini Credits Starter Pack",
    description: "200,000 Gemini credits for testing and development.",
    productId: "google-gemini",
    productName: "Google Gemini",
    creditAmount: 200000,
    startingPrice: 0.020,
    currentBid: 0.023,
    bidCount: 5,
    endsAt: new Date(Date.now() + 3600000 * 24).toISOString(),
    status: "active",
    createdBy: "usr_jkl012",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "auc_004",
    title: "Midjourney v6 Art Bundle",
    description: "50,000 Midjourney v6 credits for creative projects.",
    productId: "midjourney-v6",
    productName: "Midjourney v6",
    creditAmount: 50000,
    startingPrice: 0.075,
    currentBid: 0.082,
    bidCount: 15,
    endsAt: new Date(Date.now() + 1800000).toISOString(),
    status: "active",
    createdBy: "usr_mno345",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function AuctionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Auctions"
        description="Browse active auctions and place bids on AI credit bundles."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade", href: "/trade" },
          { label: "Auctions" },
        ]}
        actions={
          <Link href="/trade/auctions/create">
            <Button size="sm">
              <Plus className="mr-2 size-4" />
              Create Auction
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_AUCTIONS.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  )
}
