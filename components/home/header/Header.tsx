"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import { useHeaderEffects } from "@/hooks/use-header-effects"
import { DesktopActions } from "./desktop-actions"
import { MobileMenu } from "./mobile-menu"
import  MegaSearch  from "@/components/global/SearchComponent"
import  VikingsSvgIcon  from "@/components/svgs/VikingsSvgIcon"
import type { HeaderProps } from "@/types/header"

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { items, itemCount, removeItem, updateQuantity } = useCartStore()

  const cartTotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  // Wrapper functions to handle type conversion between string and number IDs
  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    updateQuantity(Number(id), quantity)
  }, [updateQuantity])

  const handleRemoveItem = useCallback((id: string) => {
    removeItem(Number(id))
  }, [removeItem])

  // Memoized callbacks
  const handleSearchOpen = useCallback(() => setIsSearchOpen(true), [])
  const handleSearchClose = useCallback(() => setIsSearchOpen(false), [])
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), [])
  const handleCartOpen = useCallback(() => {
    setIsMenuOpen(false)
    setIsCartOpen(true)
  }, [])
  const handleWishlistClick = useCallback(() => {
    // Handle wishlist logic here
  }, [])

  // Custom hook for effects
  useHeaderEffects(isMenuOpen, isCartOpen, setIsSearchOpen)

  return (
    <>
      <header className="sticky top-0 right-0 left-0 backdrop-blur-md bg-background/80 border-b z-30 px-3 sm:px-4 md:px-5 xl:px-10 py-2 sm:py-3 transition-all duration-200">
        <div className="flex items-center justify-between">
          {/* Left Section - Promo Text (Hidden on mobile) */}
          <div className="hidden lg:block flex-1">
            <h2 className="text-xs xl:text-sm text-muted-foreground">Free shipping in Nairobi and 30 days return</h2>
          </div>

          {/* Center Section - Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
            <VikingsSvgIcon className="w-12 sm:w-16 h-auto transition-transform hover:scale-105" />
            <h1 className="text-xl sm:text-2xl font-semibold text-[#353535] dark:text-white">Vikings</h1>
          </Link>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
            <DesktopActions
              user={user}
              onSearchOpen={handleSearchOpen}
              onWishlistClick={handleWishlistClick}
              isCartOpen={isCartOpen}
              onCartOpenChange={setIsCartOpen}
              items={items}
              itemCount={itemCount}
              cartTotal={cartTotal}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />

            <MobileMenu
              user={user}
              isOpen={isMenuOpen}
              onOpenChange={setIsMenuOpen}
              onSearchOpen={handleSearchOpen}
              onWishlistClick={handleWishlistClick}
              onCartOpen={handleCartOpen}
              itemCount={itemCount}
              onMenuClose={handleMenuClose}
            />
          </div>
        </div>
      </header>

      <MegaSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  )
}