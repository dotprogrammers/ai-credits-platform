"use client"

import { useEffect, useState, useCallback } from "react"

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin"
  kycVerified: boolean
  twoFactorEnabled: boolean
  affiliateCode?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

const MOCK_USER: User = {
  id: "usr_01HXYZ",
  name: "Alex Chen",
  email: "alex@example.com",
  image: undefined,
  role: "user",
  kycVerified: true,
  twoFactorEnabled: true,
  affiliateCode: "ALEX2024",
  createdAt: "2024-01-15T00:00:00Z",
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setState({
        user: MOCK_USER,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const logout = useCallback(async () => {
    setState({ user: null, isLoading: false, isAuthenticated: false, error: null })
  }, [])

  const login = useCallback(async (_email: string, _password: string) => {
    setState({ user: MOCK_USER, isLoading: false, isAuthenticated: true, error: null })
  }, [])

  return { ...state, login, logout }
}
