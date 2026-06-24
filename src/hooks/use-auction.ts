"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export interface Auction {
  id: string
  title: string
  description: string
  productId: string
  productName: string
  creditAmount: number
  startingPrice: number
  currentBid: number
  bidCount: number
  highestBidder?: string
  endsAt: string
  status: "active" | "ending_soon" | "completed" | "cancelled"
  createdBy: string
  createdAt: string
}

export interface AuctionBid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  createdAt: string
}

export interface AuctionState {
  auction: Auction | null
  bids: AuctionBid[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
}

const MOCK_AUCTION: Auction = {
  id: "auc_001",
  title: "Premium GPT-4 Credits Bundle",
  description: "500,000 GPT-4 credits at a discounted rate. Perfect for high-volume applications.",
  productId: "openai-gpt4",
  productName: "OpenAI GPT-4",
  creditAmount: 500000,
  startingPrice: 0.035,
  currentBid: 0.039,
  bidCount: 12,
  highestBidder: "usr_abc123",
  endsAt: new Date(Date.now() + 3600000 * 4).toISOString(),
  status: "active",
  createdBy: "usr_def456",
  createdAt: new Date(Date.now() - 86400000).toISOString(),
}

const MOCK_BIDS: AuctionBid[] = Array.from({ length: 12 }, (_, i) => ({
  id: `bid_${i}`,
  auctionId: "auc_001",
  bidderId: `usr_${i}`,
  bidderName: `Bidder ${i + 1}`,
  amount: 0.035 + i * 0.0004,
  createdAt: new Date(Date.now() - (12 - i) * 300000).toISOString(),
}))

export function useAuction(auctionId: string | null) {
  const [state, setState] = useState<AuctionState>({
    auction: null,
    bids: [],
    isLoading: true,
    isConnected: false,
    error: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!auctionId) return

    const timer = setTimeout(() => {
      setState({
        auction: MOCK_AUCTION,
        bids: MOCK_BIDS,
        isLoading: false,
        isConnected: true,
        error: null,
      })
    }, 400)

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (!prev.auction) return prev
        const newBid = Math.random() > 0.7
        if (newBid) {
          const newAmount = +(prev.auction.currentBid + 0.0004).toFixed(4)
          const bid: AuctionBid = {
            id: `bid_${Date.now()}`,
            auctionId: auctionId,
            bidderId: "usr_new",
            bidderName: "New Bidder",
            amount: newAmount,
            createdAt: new Date().toISOString(),
          }
          return {
            ...prev,
            auction: { ...prev.auction, currentBid: newAmount, bidCount: prev.auction.bidCount + 1 },
            bids: [...prev.bids, bid],
          }
        }
        return prev
      })
    }, 5000)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [auctionId])

  const placeBid = useCallback(async (amount: number) => {
    const bid: AuctionBid = {
      id: `bid_${Date.now()}`,
      auctionId: auctionId!,
      bidderId: "usr_01HXYZ",
      bidderName: "You",
      amount,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      auction: prev.auction ? { ...prev.auction, currentBid: amount, bidCount: prev.auction.bidCount + 1 } : null,
      bids: [...prev.bids, bid],
    }))
  }, [auctionId])

  return { ...state, placeBid }
}
