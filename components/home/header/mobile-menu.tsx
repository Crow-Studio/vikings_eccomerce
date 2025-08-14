"use client"

import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { MobileMenuItem } from "./mobile-menu-item"
import SolarMagniferOutline from "@/components/svgs/SolarMagniferOutline"
import SolarCartLarge2Outline from "@/components/svgs/SolarCartLarge2Outline"
import ShoppingBagIcon from "@/components/svgs/shoppingBag"
import WishListIcon from "@/components/svgs/Wishlist"
import VikingsSvgIcon from "@/components/svgs/VikingsSvgIcon"
import type { User } from "@/lib/server/user"

interface MobileMenuProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSearchOpen: () => void
  onWishlistClick: () => void
  onCartOpen: () => void
  itemCount: number
  onMenuClose: () => void
}

export const MobileMenu = memo(
  ({
    user,
    isOpen,
    onOpenChange,
    onSearchOpen,
    onWishlistClick,
    onCartOpen,
    itemCount,
    onMenuClose,
  }: MobileMenuProps) => (
    <div className="sm:hidden">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full transition-all duration-200 hover:scale-105 hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] backdrop-blur-md bg-background/95 border-l z-50">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <VikingsSvgIcon className="w-12 h-auto" />
              <p className="text-xl font-semibold">Vikings</p>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="text-xs text-muted-foreground border-b pb-4">
              Free shipping in Nairobi and 30 days return
            </div>
            <div className="space-y-3">
              <MobileMenuItem
                icon={SolarMagniferOutline}
                label="Search"
                onClick={onSearchOpen}
                onMenuClose={onMenuClose}
              />
              <MobileMenuItem icon={ShoppingBagIcon} label="Shop" href="/products" onMenuClose={onMenuClose} />
              <MobileMenuItem
                icon={WishListIcon}
                label="Wishlist"
                onClick={onWishlistClick}
                badge="2"
                onMenuClose={onMenuClose}
              />
              <MobileMenuItem
                icon={SolarCartLarge2Outline}
                label="Cart"
                onClick={onCartOpen}
                badge={itemCount > 0 ? itemCount : undefined}
                onMenuClose={onMenuClose}
              />
            </div>
            <Separator />
            <div className="pt-4">
              {user ? (
                <Link href="/account/dashboard" className="block w-full" onClick={onMenuClose}>
                  <Button className="w-full transition-all duration-200 hover:scale-105">Account</Button>
                </Link>
              ) : (
                <Link href="/auth/admin/signin" className="block w-full" onClick={onMenuClose}>
                  <Button className="w-full transition-all duration-200 hover:scale-105">Sign in</Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  ),
)

MobileMenu.displayName = "MobileMenu"
