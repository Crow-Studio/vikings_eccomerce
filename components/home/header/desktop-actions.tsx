"use client"

import { memo } from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { IconButton } from "./icon-button"
import { CartSheet } from "./cart-sheet"
import SolarMagniferOutline from "@/components/svgs/SolarMagniferOutline"
import ShoppingBagIcon from "@/components/svgs/shoppingBag"
import WishListIcon from "@/components/svgs/Wishlist"
import type { User } from "@/lib/server/user"

interface DesktopActionsProps {
  user: User | null
  onSearchOpen: () => void
  onWishlistClick: () => void
  isCartOpen: boolean
  onCartOpenChange: (open: boolean) => void
  items: any[]
  itemCount: number
  cartTotal: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export const DesktopActions = memo(
  ({
    user,
    onSearchOpen,
    onWishlistClick,
    isCartOpen,
    onCartOpenChange,
    items,
    itemCount,
    cartTotal,
    onUpdateQuantity,
    onRemoveItem,
  }: DesktopActionsProps) => (
    <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
      <TooltipProvider>
        <IconButton icon={SolarMagniferOutline} tooltip="Search (⌘K)" onClick={onSearchOpen} />
        <Link href="/products">
          <IconButton icon={ShoppingBagIcon} tooltip="Shop" />
        </Link>
        <IconButton icon={WishListIcon} tooltip="Wishlist" onClick={onWishlistClick} badge="2" />
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
