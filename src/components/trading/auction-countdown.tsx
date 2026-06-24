"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AuctionCountdownProps {
  endsAt: string
  className?: string
}

export function AuctionCountdown({ endsAt, className }: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(endsAt).getTime() - Date.now()
    return Math.max(0, diff)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(endsAt).getTime() - Date.now()
      setTimeLeft(Math.max(0, diff))
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  const days = Math.floor(timeLeft / 86400000)
  const hours = Math.floor((timeLeft % 86400000) / 3600000)
  const minutes = Math.floor((timeLeft % 3600000) / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  const isUrgent = timeLeft < 3600000 // less than 1 hour

  return (
    <div className={cn("flex items-center gap-1 font-mono text-sm font-bold", isUrgent && "text-red-500", className)}>
      {days > 0 && (
        <>
          <span className="rounded bg-muted px-1.5 py-0.5 text-center min-w-[2ch]">{days}</span>
          <span className="text-muted-foreground">d</span>
        </>
      )}
      <span className="rounded bg-muted px-1.5 py-0.5 text-center min-w-[2ch]">{hours.toString().padStart(2, "0")}</span>
      <span className="text-muted-foreground">:</span>
      <span className="rounded bg-muted px-1.5 py-0.5 text-center min-w-[2ch]">{minutes.toString().padStart(2, "0")}</span>
      <span className="text-muted-foreground">:</span>
      <span className={cn("rounded px-1.5 py-0.5 text-center min-w-[2ch]", isUrgent ? "bg-red-500/10 text-red-500" : "bg-muted")}>
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
