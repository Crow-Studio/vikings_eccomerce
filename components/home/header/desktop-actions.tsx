"use client"

import { memo } from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { IconButton } from "@/components/home/header/icon-button"
import { CartSheet } from "./cart-sheet"
import { WishlistSheet } from "@/components/global/wishlist-sheet"
import SolarMagniferOutline from "@/components/svgs/SolarMagniferOutline"
import ShoppingBagIcon from "@/components/svgs/shoppingBag"
import BlogIcon from '@/components/svgs/blogIcon'
import type { User } from "@/lib/server/user"
import type { CartItem } from "@/store/cart-store"
import type { WishlistItem } from "@/types/header"

interface DesktopActionsProps {
  user: User | null
  onSearchOpen: () => void
  onWishlistClick: () => void
  isCartOpen: boolean
  onCartOpenChange: (open: boolean) => void
  isWishlistOpen: boolean
  onWishlistOpenChange: (open: boolean) => void
  items: CartItem[]
  itemCount: number
  cartTotal: number
  wishlistItems: WishlistItem[]
  wishlistItemCount: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onRemoveWishlistItem: (id: string) => void
}

export const DesktopActions = memo(
  ({
    user,
    onSearchOpen,
    isCartOpen,
    onCartOpenChange,
    isWishlistOpen,
    onWishlistOpenChange,
    items,
    itemCount,
    cartTotal,
    wishlistItems,
    wishlistItemCount,
    onUpdateQuantity,
    onRemoveItem,
    onRemoveWishlistItem,
  }: DesktopActionsProps) => (
    <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
      <TooltipProvider>
        <IconButton icon={SolarMagniferOutline} tooltip="Search (⌘K)" onClick={onSearchOpen} />
        <Link href="/products">
          <IconButton icon={ShoppingBagIcon} tooltip="Shop" />
        </Link>
        <Link href="/blogs">
          <IconButton 
            icon={BlogIcon}
            tooltip="Blogs"
          />
        </Link>
        
        <WishlistSheet
          isOpen={isWishlistOpen}
          onOpenChange={onWishlistOpenChange}
          items={wishlistItems}
          itemCount={wishlistItemCount}
          onRemoveItem={onRemoveWishlistItem}
        />
        <CartSheet
          isOpen={isCartOpen}
          onOpenChange={onCartOpenChange}
          items={items}
          itemCount={itemCount}
          cartTotal={cartTotal}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      </TooltipProvider>
      <Separator orientation="vertical" className="h-4 mx-1 md:mx-2" />
      
      {user ? (
        <Link
          href="/account/dashboard"
          className="text-xs md:text-sm hover:text-primary transition-colors whitespace-nowrap hover:scale-105 transform duration-200"
        >
          Account
        </Link>
      ) : (
        <Link
          href="/auth/signin"
          className="text-xs md:text-sm hover:text-primary transition-colors whitespace-nowrap hover:scale-105 transform duration-200"
        >
          Sign in
        </Link>
      )}
    </div>
  ),
)

DesktopActions.displayName = "DesktopActions"