import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function GlassCard({ children, className, size = "md" }: GlassCardProps) {
  const sizeClass = {
    sm: "glass-sm p-4",
    md: "glass-md p-6",
    lg: "glass-lg p-8",
  }[size]

  return <div className={cn(sizeClass, "transition-all hover:bg-card/60", className)}>{children}</div>
}
