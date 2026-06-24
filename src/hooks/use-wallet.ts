"use client"

import { useEffect, useState } from "react"

export interface WalletBalance {
  available: number
  locked: number
  total: number
  currency: string
}

export interface WalletState {
  usd: WalletBalance
  credits: Record<string, WalletBalance>
  isLoading: boolean
  error: string | null
}

const MOCK_WALLET: WalletState = {
  usd: { available: 12450.75, locked: 2300.0, total: 14750.75, currency: "USD" },
  credits: {
    "openai-gpt4": { available: 150000, locked: 25000, total: 175000, currency: "credits" },
    "anthropic-claude": { available: 85000, locked: 10000, total: 95000, currency: "credits" },
    "google-gemini": { available: 200000, locked: 0, total: 200000, currency: "credits" },
    "meta-llama": { available: 500000, locked: 50000, total: 550000, currency: "credits" },
    "midjourney-v6": { available: 12000, locked: 3000, total: 15000, currency: "credits" },
  },
  isLoading: false,
  error: null,
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    usd: { available: 0, locked: 0, total: 0, currency: "USD" },
    credits: {},
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const timer = setTimeout(() => setState(MOCK_WALLET), 400)
    return () => clearTimeout(timer)
  }, [])

  const refetch = () => {
    setState({ ...state, isLoading: true })
    setTimeout(() => setState(MOCK_WALLET), 400)
  }

  return { ...state, refetch }
}
