"use client"
import type React from "react"
import { useState, useEffect } from "react"
import SolarMagniferOutline from "../svgs/SolarMagniferOutline"
import SolarCartLarge2Outline from "../svgs/SolarCartLarge2Outline"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "../ui/sheet"
import { Menu, X, Plus, Minus } from "lucide-react"
import Link from "next/link"
import ShoppingBagIcon from "../svgs/shoppingBag"
import WishListIcon from "../svgs/Wishlist"
import MegaSearch from "../global/SearchComponent"
import { useCartStore } from "@/store/cart-store"
import VikingsSvgIcon from "../svgs/VikingsSvgIcon"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { items, itemCount, removeItem, updateQuantity } = useCartStore()

  // Calculate cart total
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Simplified body scroll lock
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen, isCartOpen])

  // Add minimal CSS for smooth sheet animation only
  useEffect(() => {
    const styleId = "smooth-menu-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        /* Smooth sheet animation */
        [data-radix-dialog-content] {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Smooth overlay animation */
        [data-radix-dialog-overlay] {
          transition: opacity 0.2s ease-in-out !important;
        }
        
        /* Prevent layout shifts on mobile */
        @media (max-width: 640px) {
          body {
            padding-right: 0 !important;
          }
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const IconButton = ({
    icon: Icon,
    tooltip,
    onClick,
    badge,
  }: {
    icon: React.ComponentType<{ className?: string }>
    tooltip: string
    onClick?: () => void
    badge?: string | number
  }) => (
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
  )

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
            <h1 className="text-xl sm:text-2xl font-semibold text-[#353535] dark:text-white">
              Vikings
            </h1>
          </Link>
          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
              <TooltipProvider>
                <IconButton icon={SolarMagniferOutline} tooltip="Search (⌘K)" onClick={() => setIsSearchOpen(true)} />
                <Link href="/products">
                  <IconButton icon={ShoppingBagIcon} tooltip="Shop" />
                </Link>
                <IconButton
                  icon={WishListIcon}
                  tooltip="Wishlist"
                  onClick={() => {
                    /* Handle wishlist */
                  }}
                  badge="2"
                />
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                  <SheetTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full cursor-pointer relative h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 hover:scale-105"
                    >
                      <SolarCartLarge2Outline className="h-4 w-4 sm:h-5 sm:w-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] animate-pulse">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md">
                    <SheetHeader className="mb-5">
                      <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
                    </SheetHeader>

                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[60vh]">
                        <SolarCartLarge2Outline className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-6">Your cart is empty</p>
                        <SheetClose asChild>
                          <Link href="/products">
                            <Button>Continue Shopping</Button>
                          </Link>
                        </SheetClose>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6 max-h-[60vh] overflow-auto pr-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-8 h-8 bg-primary/20 rounded"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">KSh {item.price.toLocaleString()}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors text-red-600 self-start"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">KSh {cartTotal.toLocaleString()}</span>
                          </div>

                          <div className="flex flex-col gap-2">
                            <SheetClose asChild>
                              <Link href="/checkout">
                                <Button className="w-full">Checkout</Button>
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link href="/products">
                                <Button variant="outline" className="w-full bg-transparent">
                                  Continue Shopping
                                </Button>
                              </Link>
                            </SheetClose>
                          </div>
                        </div>
                      </>
                    )}
                  </SheetContent>
                </Sheet>
              </TooltipProvider>

              <Separator orientation="vertical" className="h-4 mx-1 md:mx-2" />

              <Link
                href="/auth/signin"
                className="text-xs md:text-sm hover:text-primary transition-colors whitespace-nowrap hover:scale-105 transform duration-200"
              >
                Sign in
              </Link>
            </div>
            {/* Mobile Menu */}
            <div className="sm:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                      <p className="text-xl font-semibold">
                        Vikings
                      </p>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {/* Promo Text for Mobile */}
                    <div className="text-xs text-muted-foreground border-b pb-4">
                      Free shipping in Nairobi and 30 days return
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsSearchOpen(true)
                        }}
                      >
                        <SolarMagniferOutline className="h-5 w-5" />
                        Search
                      </Button>

                      <Link href="/products">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12 transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                          onClick={() => {
                            setIsMenuOpen(false)
                          }}
                        >
                          <ShoppingBagIcon className="h-5 w-5" />
                          Shop
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 relative transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                        onClick={() => {
                          setIsMenuOpen(false)
                          // Handle wishlist
                        }}
                      >
                        <WishListIcon className="h-5 w-5" />
                        Wishlist
                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          2
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 relative transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsCartOpen(true)
                        }}
                      >
                        <SolarCartLarge2Outline className="h-5 w-5" />
                        Cart
                        {itemCount > 0 && (
                          <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                            {itemCount}
                          </span>
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <div className="pt-4">
                      <Link href="/auth/signin" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full transition-all duration-200 hover:scale-105">Sign in</Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      {/* Search Component */}
      <MegaSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
