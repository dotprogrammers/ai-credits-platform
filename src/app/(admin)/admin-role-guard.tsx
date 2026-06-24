"use client"

import { redirect } from "next/navigation"
import { useState, useEffect } from "react"

/**
 * Admin role guard - checks if the current user has admin privileges.
 * In production, this would check a session/JWT for admin role.
 * For now, it renders children directly (mock guard).
 */
export function AdminRoleGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual auth check
    // const session = await getServerSession()
    // if (!session?.user?.role === 'ADMIN') redirect('/login')
    const isAdmin = true // Mock: always authorized in dev
    if (!isAdmin) {
      redirect("/login")
    }
    setIsAuthorized(true)
  }, [])

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔒</div>
          <h1 className="text-xl font-semibold">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
