import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface GlassAlertProps {
  children: ReactNode
  className?: string
  variant?: "success" | "error" | "warning" | "info"
  title?: string
  icon?: boolean
}

export function GlassAlert({ children, className, variant = "info", title, icon = true }: GlassAlertProps) {
  const variantClass = {
    success: "border-green-500/30 bg-green-500/10 text-green-900 dark:text-green-300",
    error: "border-red-500/30 bg-red-500/10 text-red-900 dark:text-red-300",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-900 dark:text-yellow-300",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-900 dark:text-blue-300",
  }[variant]

  const iconClass = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }[variant]

  return (
    <div className={cn("glass-md border-2 p-4 flex gap-3", variantClass, className)}>
      {icon && <div className="shrink-0">{iconClass}</div>}
      <div className="flex-1">
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  )
}
