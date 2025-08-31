import * as React from "react"
import { cn } from "@/lib/utils"
interface StepIndicatorProps {
  step: number
  title: string
  isActive: boolean
  isCompleted: boolean
}
export const StepIndicator = React.memo(({ step, title, isActive, isCompleted }: StepIndicatorProps) => (
  <div
    className={cn(
      "flex items-center",
      isActive ? "text-primary" : isCompleted ? "text-primary" : "text-muted-foreground",
    )}
  >
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
        isActive
          ? "bg-primary text-primary-foreground"
          : isCompleted
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
      )}
    >
      {step}
    </div>
    <span className="ml-2 text-sm font-medium hidden sm:inline">{title}</span>
  </div>
))
StepIndicator.displayName = "StepIndicator"
