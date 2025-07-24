import type React from "react"
import type { User } from "@/lib/server/user"
import type { CartItem } from "@/store/cart-store" // Import CartItem from your store

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
  item: CartItem // Use the CartItem type from the store
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

// New type for Wishlist Item
export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  selectedVariants?: Record<string, string>
}
