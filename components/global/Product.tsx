"use client"

import { cn } from "@/lib/utils"

import type * as React from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store" // Import cart store
import { useWishlistStore } from "@/store/wishlist-store" // Import wishlist store
import ProductSkeleton from "./ProductSkeleton"
import type { DBProduct } from "@/types" // Import DBProduct type

interface ProductUIProps {
  product?: DBProduct
  isLoading?: boolean
}

// Helper function to check if product is new (within last 1 day)
function isNewProduct(createdAt: Date): boolean {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  return createdAt > oneDayAgo
}

export default function ProductUI({ product, isLoading = false }: ProductUIProps) {
  const { addItem } = useCartStore()
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isWishlisted } = useWishlistStore()

  if (isLoading || !product) {
    return <ProductSkeleton />
  }

  const isNew = isNewProduct(new Date(product.created_at))
  const isCurrentlyWishlisted = isWishlisted(product.id)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation() // Prevent triggering parent click events

    if (isCurrentlyWishlisted) {
      removeWishlistItem(product.id)
    } else {
      addWishlistItem({
        id: product.id,
        name: product.name,
        price: Number.parseFloat(product.price),
        image: product.images[0]?.url || "/placeholder.svg", // Use first image or placeholder
        selectedVariants: {}, // Default empty variants for product card
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation()

    addItem(
      {
        id: product.id,
        name: product.name,
        price: Number.parseFloat(product.price),
        image: product.images[0]?.url || "/placeholder.svg", // Use first image or placeholder
        selectedVariants: {}, // Default empty variants for product card
      },
      1, // Add 1 quantity by default from product card
    )
    console.log(`Added to cart: ${product.name}`)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    // Don't prevent default - let the Link navigation work
    e.stopPropagation()
    // The Link wrapper will handle the navigation
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="grid gap-1.5 group cursor-pointer">
        <div className="h-[15rem] rounded-lg overflow-hidden relative transition-shadow duration-300 bg-white shadow shadow-white border border-gray-200 dark:border-slate-700">
          {/* New Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">New</span>
            </div>
          )}
          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart
              className={cn(
                "w-3.5 h-3.5 text-gray-600 group-hover/wishlist:text-black transition-colors duration-200",
                isCurrentlyWishlisted &&
                  "fill-red-500 text-red-500 group-hover/wishlist:fill-red-600 group-hover/wishlist:text-red-600",
              )}
            />
          </button>
          <Image
            src={product.images[0]?.url || "/placeholder.svg?height=240&width=240&text=Product Image"}
            alt={`${product.name.toLowerCase()}_${product.images[0]?.id}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3 grid sm:group-hover:grid gap-y-1.5 sm:hidden transition-all duration-200">
            <button
              onClick={handleAddToCart}
              className="p-0.5 rounded-md w-full bg-white/90 backdrop-blur-sm border border-gray-200 group/wishlist shadow-sm dark:text-black hover:bg-zinc-200 cursor-pointer transition-colors duration-200"
              aria-label="Add to cart"
            >
              Add to cart
            </button>
            <button
              onClick={handleViewDetails}
              className="p-0.5 rounded-md w-full bg-white/90 backdrop-blur-sm border border-gray-200 group/wishlist shadow-sm dark:text-black hover:bg-zinc-200 cursor-pointer transition-colors duration-200"
              aria-label="View details"
            >
              View Details
            </button>
          </div>
        </div>
        <div className="grid gap-y-1.5">
          <div className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
            {product.name}
          </div>
          <p className="text-xs text-muted-foreground font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            KSh {Number.parseFloat(product.price).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}
