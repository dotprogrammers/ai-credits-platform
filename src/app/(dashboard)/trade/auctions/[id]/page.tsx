"use client"

import { PageHeader } from "@/components/shared/page-header"
import { AuctionDetail } from "@/components/trading/auction-detail"
import { useAuction } from "@/hooks/use-auction"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = { id: "auc_001" } // In production, use React.use(params)
  const { auction, bids, isLoading, placeBid } = useAuction(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Auction Detail"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Trade", href: "/trade" },
            { label: "Auctions", href: "/trade/auctions" },
            { label: "Loading..." },
          ]}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card><CardContent className="pt-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
            <Card><CardContent className="pt-6"><Skeleton className="h-60 w-full" /></CardContent></Card>
          </div>
          <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="space-y-6">
        <PageHeader title="Auction Not Found" />
        <p className="text-muted-foreground">The auction you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={auction.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Trade", href: "/trade" },
          { label: "Auctions", href: "/trade/auctions" },
          { label: auction.title },
        ]}
      />
      <AuctionDetail auction={auction} bids={bids} onPlaceBid={placeBid} />
    </div>
  )
}
