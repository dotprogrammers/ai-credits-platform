"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gavel, Clock, Users } from "lucide-react"
import type { Auction } from "@/hooks/use-auction"

interface AuctionCardProps {
  auction: Auction
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const endsAt = new Date(auction.endsAt)
  const now = new Date()
  const timeLeft = endsAt.getTime() - now.getTime()
  const hours = Math.floor(timeLeft / 3600000)
  const minutes = Math.floor((timeLeft % 3600000) / 60000)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Gavel className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{auction.title}</h3>
                <p className="text-xs text-muted-foreground">{auction.productName}</p>
              </div>
            </div>
            <Badge variant={auction.status === "active" ? "default" : "secondary"}>
              {auction.status}
            </Badge>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg bg-muted p-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Current Bid</p>
              <p className="text-sm font-bold font-mono">${auction.currentBid.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Credits</p>
              <p className="text-sm font-bold">{auction.creditAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Bids</p>
              <p className="text-sm font-bold">{auction.bidCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {hours}h {minutes}m left
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3" />
                {auction.bidCount} bids
              </span>
            </div>
            <Link href={`/trade/auctions/${auction.id}`}>
              <Button size="sm">View</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
