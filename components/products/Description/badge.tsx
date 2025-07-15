import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning"
  className?: string
  children: React.ReactNode
}

export const Badge = React.memo(({ children, variant = "default", className = "" }: BadgeProps) => {
  const variants = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
})
Badge.displayName = "Badge"
