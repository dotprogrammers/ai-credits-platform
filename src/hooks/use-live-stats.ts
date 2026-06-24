"use client"

import { useEffect, useState, useRef } from "react"

export interface PlatformStats {
  totalVolume24h: number
  totalTrades24h: number
  activeUsers: number
  totalListings: number
  avgPriceChange24h: number
  topProducts: {
    name: string
    price: number
    change24h: number
    volume24h: number
  }[]
}

const MOCK_STATS: PlatformStats = {
  totalVolume24h: 2847563.42,
  totalTrades24h: 14832,
  activeUsers: 3241,
  totalListings: 892,
  avgPriceChange24h: 2.34,
  topProducts: [
    { name: "OpenAI GPT-4", price: 0.042, change24h: 3.2, volume24h: 842500 },
    { name: "Anthropic Claude", price: 0.038, change24h: -1.5, volume24h: 623400 },
    { name: "Google Gemini", price: 0.025, change24h: 5.8, volume24h: 412300 },
    { name: "Meta Llama", price: 0.015, change24h: 1.2, volume24h: 385200 },
    { name: "Midjourney v6", price: 0.085, change24h: -0.8, volume24h: 298100 },
  ],
}

export function useLiveStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(MOCK_STATS)
      setIsLoading(false)
    }, 300)

    intervalRef.current = setInterval(() => {
      setStats((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          totalVolume24h: prev.totalVolume24h + Math.random() * 1000,
          totalTrades24h: prev.totalTrades24h + Math.floor(Math.random() * 5),
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        }
      })
    }, 3000)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { stats, isLoading }
}
