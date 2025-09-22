"use client"
import { memo, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { MobileMenuItemProps } from "@/types/header"
export const MobileMenuItem = memo(({ icon: Icon, label, href, onClick, badge, onMenuClose }: MobileMenuItemProps) => {
  const handleClick = useCallback(() => {
    onMenuClose()
    onClick?.()
  }, [onMenuClose, onClick])
  const content = (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 h-12 relative transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
      onClick={handleClick}
    >
      <Icon className="h-5 w-5" />
      {label}
      {badge && (
        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {badge}
        </span>
      )}
    </Button>
  )
  return href ? (
    <Link href={href} onClick={onMenuClose}>
      {content}
    </Link>
  ) : (
    content
  )
})
MobileMenuItem.displayName = "MobileMenuItem"
