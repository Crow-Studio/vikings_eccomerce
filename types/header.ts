import type React from "react"
import type { User } from "@/lib/server/user"

export interface HeaderProps {
  user: User | null
}

export interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
  onClick?: () => void
  badge?: string | number
}

export interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export interface MobileMenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href?: string
  onClick?: () => void
  badge?: string | number
  onMenuClose: () => void
}
