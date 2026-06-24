"use client"

import { useEffect, useState, useCallback, useRef } from "react"

export interface Notification {
  id: string
  type: "trade" | "order" | "system" | "auction" | "affiliate"
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "trade",
    title: "Trade Executed",
    message: "Your buy order for 10,000 GPT-4 credits was filled at $0.042/credit.",
    read: false,
    createdAt: new Date(Date.now() - 60000).toISOString(),
    actionUrl: "/history/trd_001",
  },
  {
    id: "n2",
    type: "auction",
    title: "Auction Outbid",
    message: "You have been outbid on the Premium Claude Credits Bundle. Current bid: $0.039.",
    read: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    actionUrl: "/trade/auctions/auc_001",
  },
  {
    id: "n3",
    type: "affiliate",
    title: "Commission Earned",
    message: "You earned $42.50 in commission from a referred user's trade.",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: "/affiliates/commissions",
  },
  {
    id: "n4",
    type: "system",
    title: "KYC Verified",
    message: "Your identity verification has been approved. All features are now available.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n5",
    type: "order",
    title: "Order Partially Filled",
    message: "Your limit sell order for 5,000 Gemini credits is 60% filled.",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    actionUrl: "/history/trd_002",
  },
]

export function useNotifications() {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    unreadCount: 0,
    isLoading: true,
    error: null,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length
      setState({
        notifications: MOCK_NOTIFICATIONS,
        unreadCount: unread,
        isLoading: false,
        error: null,
      })
    }, 300)

    intervalRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        unreadCount: prev.notifications.filter((n) => !n.read).length,
      }))
    }, 5000)

    return () => {
      clearTimeout(timer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const markAsRead = useCallback((id: string) => {
    setState((prev) => {
      const notifications = prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return {
        ...prev,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      }
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  }, [])

  return { ...state, markAsRead, markAllAsRead }
}
