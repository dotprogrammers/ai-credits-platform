"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Gavel, Clock, Users, DollarSign, Package } from "lucide-react"
import { AuctionCountdown } from "@/components/trading/auction-countdown"
import { BidForm } from "@/components/trading/bid-form"
import type { Auction, AuctionBid } from "@/hooks/use-auction"

interface AuctionDetailProps {
  auction: Auction
  bids: AuctionBid[]
  onPlaceBid: (amount: number) => void
}

export function AuctionDetail({ auction, bids, onPlaceBid }: AuctionDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Info */}
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Gavel className="size-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{auction.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{auction.productName}</p>
                </div>
              </div>
              <Badge variant={auction.status === "active" ? "default" : "secondary"}>
                {auction.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">{auction.description}</p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="size-3" />
                  Current Bid
                </div>
                <p className="mt-1 text-lg font-bold font-mono">${auction.currentBid.toFixed(4)}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="size-3" />
                  Credits
                </div>
                <p className="mt-1 text-lg font-bold">{auction.creditAmount.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3" />
                  Total Bids
                </div>
                <p className="mt-1 text-lg font-bold">{auction.bidCount}</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  Time Left
                </div>
                <AuctionCountdown endsAt={auction.endsAt} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bid History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Bid History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...bids].reverse().map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium">
                      {bid.bidderName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{bid.bidderName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium">${bid.amount.toFixed(4)}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(bid.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bid Form */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="text-sm">Place a Bid</CardTitle>
          </CardHeader>
          <CardContent>
            <BidForm
              currentBid={auction.currentBid}
              onSubmit={onPlaceBid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
