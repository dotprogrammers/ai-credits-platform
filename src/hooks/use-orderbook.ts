"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export interface OrderBookLevel {
  price: number
  quantity: number
  total: number
}

export interface OrderBookData {
  productId: string
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
  lastPrice: number
  lastUpdate: number
  spread: number
  spreadPercent: number
}

const MOCK_ORDERBOOK: OrderBookData = {
  productId: "openai-gpt4",
  lastPrice: 0.042,
  lastUpdate: Date.now(),
  spread: 0.002,
  spreadPercent: 4.76,
  bids: Array.from({ length: 15 }, (_, i) => ({
    price: 0.041 - i * 0.001,
    quantity: Math.floor(Math.random() * 50000) + 5000,
    total: 0,
  })).map((level, i, arr) => ({
    ...level,
    total: arr.slice(0, i + 1).reduce((sum, l) => sum + l.quantity, 0),
  })),
  asks: Array.from({ length: 15 }, (_, i) => ({
    price: 0.043 + i * 0.001,
    quantity: Math.floor(Math.random() * 50000) + 5000,
    total: 0,
  })).map((level, i, arr) => ({
    ...level,
    total: arr.slice(0, i + 1).reduce((sum, l) => sum + l.quantity, 0),
  })),
}

export function useOrderBook(productId: string) {
  const [data, setData] = useState<OrderBookData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setData(MOCK_ORDERBOOK)
      setIsLoading(false)
      setIsConnected(true)
    }, 500)

    intervalRef.current = setInterval(() => {
      setData((prev) => {
        if (!prev) return prev
        const jitter = (Math.random() - 0.5) * 0.0005
        return {
          ...prev,
          lastPrice: +(prev.lastPrice + jitter).toFixed(4),
          lastUpdate: Date.now(),
          spread: +(prev.spread + (Math.random() - 0.5) * 0.0002).toFixed(4),
        }
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [productId])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  return { data, isLoading, isConnected, disconnect }
}
