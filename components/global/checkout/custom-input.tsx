import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground block">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-lg border border-muted bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
          error ? "border-red-500" : "",
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  ),
)
Input.displayName = "Input"
