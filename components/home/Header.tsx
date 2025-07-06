'use client'
import React, { useState, useEffect } from "react";
import DeliriumSvgIcon from "../svgs/DeliriumSvgIcon";
import SolarMagniferOutline from "../svgs/SolarMagniferOutline";
import SolarCartLarge2Outline from "../svgs/SolarCartLarge2Outline";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import ShoppingBagIcon from "../svgs/shoppingBag";
import WishListIcon from "../svgs/Wishlist";
import MegaSearch from '../global/SearchComponent';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Simplified body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Add minimal CSS for smooth sheet animation only
  useEffect(() => {
    const styleId = 'smooth-menu-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  const IconButton = ({ icon: Icon, tooltip, onClick, badge }: {
    icon: React.ComponentType<{ className?: string }>;
    tooltip: string;
    onClick?: () => void;
    badge?: string | number;
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
  );

  return (
    <>
      <header className="sticky top-0 right-0 left-0 backdrop-blur-md bg-background/80 border-b z-30 px-3 sm:px-4 md:px-5 xl:px-10 py-2 sm:py-3 transition-all duration-200">
        <div className="flex items-center justify-between">
          {/* Left Section - Promo Text (Hidden on mobile) */}
          <div className="hidden lg:block flex-1">
            <h2 className="text-xs xl:text-sm text-muted-foreground">
              Free shipping in Nairobi and 30 days return
            </h2>
          </div>

          {/* Center Section - Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <DeliriumSvgIcon className="w-6 h-auto sm:w-7 transition-transform hover:scale-105" />
            <h1 className="text-lg sm:text-xl font-semibold text-[#353535] dark:text-white">
              Vikings
            </h1>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center space-x-1 md:space-x-2">
              <TooltipProvider>
                <IconButton
                  icon={SolarMagniferOutline}
                  tooltip="Search (⌘K)"
                  onClick={() => setIsSearchOpen(true)}
                />
                <IconButton
                  icon={ShoppingBagIcon}
                  tooltip="Shop"
                  onClick={() => {/* Handle shop */}}
                />
                <IconButton
                  icon={WishListIcon}
                  tooltip="Wishlist"
                  onClick={() => {/* Handle wishlist */}}
                  badge="2"
                />
                <IconButton
                  icon={SolarCartLarge2Outline}
                  tooltip="Cart"
                  onClick={() => {/* Handle cart */}}
                  badge="3"
                />
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
                <SheetContent 
                  side="right" 
                  className="w-[280px] backdrop-blur-md bg-background/95 border-l z-50"
                >
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <DeliriumSvgIcon className="w-6 h-auto" />
                      Vikings
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
                          setIsMenuOpen(false);
                          setIsSearchOpen(true);
                        }}
                      >
                        <SolarMagniferOutline className="h-5 w-5" />
                        Search
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                        onClick={() => {
                          setIsMenuOpen(false);
                          // Handle shop
                        }}
                      >
                        <ShoppingBagIcon className="h-5 w-5" />
                        Shop
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 relative transition-all duration-200 hover:bg-primary/5 hover:translate-x-1"
                        onClick={() => {
                          setIsMenuOpen(false);
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
                          setIsMenuOpen(false);
                          // Handle cart
                        }}
                      >
                        <SolarCartLarge2Outline className="h-5 w-5" />
                        Cart
                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          3
                        </span>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-4">
                      <Link 
                        href="/auth/signin"
                        className="block w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full transition-all duration-200 hover:scale-105">
                          Sign in
                        </Button>
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
      <MegaSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}