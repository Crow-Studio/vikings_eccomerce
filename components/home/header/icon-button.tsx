"use client"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { IconButtonProps } from "@/types/header"
export const IconButton = memo(({ icon: Icon, tooltip, onClick, badge }: IconButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer relative h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 hover:scale-105"
          onClick={onClick}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          {badge && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] animate-pulse">
              {badge}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
))
IconButton.displayName = "IconButton"
