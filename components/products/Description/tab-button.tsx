"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabButtonProps {
  id: string
  label: string
  isActive: boolean
  onClick: (id: string) => void
}

export const TabButton = React.memo(({ id, label, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={() => onClick(id)}
    className={cn(
      "px-4 py-2 text-sm font-medium transition-colors border-b-2",
      isActive ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground",
    )}
    role="tab"
    aria-selected={isActive}
    id={`tab-${id}`}
    aria-controls={`panel-${id}`}
  >
    {label}
  </button>
))
TabButton.displayName = "TabButton"
