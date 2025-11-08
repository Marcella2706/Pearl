import React from "react"
import { cn } from "@/lib/utils"

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "glass" | "outline"
  size?: "sm" | "md" | "lg"
}

export function ModernButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ModernButtonProps) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"

  const variants = {
    primary: "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 active:scale-95",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    glass: "glass-card text-foreground hover:shadow-lg hover:shadow-primary/20",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
