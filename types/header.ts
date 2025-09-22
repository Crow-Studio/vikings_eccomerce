import type React from "react"
import type { User } from "@/lib/server/user"
import type { CartItem } from "@/store/cart-store" 
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
  item: CartItem 
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
export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  selectedVariants?: Record<string, string>
}
