import React from "react"
import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
  count?: number
  variant?: "card" | "line" | "circle"
  className?: string
}

export function SkeletonLoader({ count = 3, variant = "card", className }: SkeletonLoaderProps) {
  const items = Array.from({ length: count })

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div
            key={i}
            className="glass-card space-y-4 animate-pulse"
          >
            <div className="h-8 bg-linear-to-r from-muted to-muted/50 rounded-lg animate-shimmer" />
            <div className="space-y-3">
              <div className="h-4 bg-linear-to-r from-muted to-muted/50 rounded animate-shimmer" />
              <div className="h-4 bg-linear-to-r from-muted to-muted/50 rounded animate-shimmer w-5/6" />
            </div>
            <div className="h-10 bg-linear-to-r from-primary/20 to-primary/10 rounded-lg animate-shimmer" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "line") {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="h-20 bg-linear-to-r from-muted to-muted/50 rounded-xl animate-shimmer" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex gap-4", className)}>
      {items.map((_, i) => (
        <div
          key={i}
          className="w-16 h-16 rounded-full bg-linear-to-r from-muted to-muted/50 animate-shimmer"
        />
      ))}
    </div>
  )
}
