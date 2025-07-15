"use client"
import type React from "react"
import { useState } from "react"
import { Star, Heart } from "lucide-react"
import ShoppingBagIcon from "../svgs/shoppingBag"
import { mockProducts } from "../../data/products"
import type { Product, ProductCardProps, ProductsProps } from "@/types/product"
import Link from "next/link"
import Image from "next/image"

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false)

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 p-6 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer">
          <div className="flex gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
              src={Array.isArray(product.images) ? product.images[0] : product.images || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              />
              {product.isNew && (
              <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                New
              </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {product.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIsWishlisted(!isWishlisted)
                  }}
                  className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
                >
                  <Heart size={20} className={isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"} />
                </button>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{product.category}</p>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star size={16} className="fill-primary text-primary" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-800 dark:text-white">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <span className="text-sm text-primary font-medium">View Details</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <div className="relative overflow-hidden">
            <div className="aspect-square bg-[#f3f2f3] dark:bg-slate-800 relative">
            <Image
              src={Array.isArray(product.images) ? product.images[0] : product.images || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            </div>

          {product.isNew && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Heart
              size={18}
              className={isWishlisted ? "fill-primary text-primary" : "text-slate-600 dark:text-slate-400"}
            />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-2">
            <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{product.category}</p>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              KSh {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">KSh {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="text-center py-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm text-primary font-medium">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const Products: React.FC<ProductsProps> = ({ filters, searchQuery, sortBy, viewMode }) => {
  const filteredProducts = mockProducts.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)

    const matchesPrice =
      !filters.priceRange || (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return Number(b.isNew) - Number(a.isNew)
      default:
        return 0
    }
  })

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 flex justify-center">
          <ShoppingBagIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
        <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div
      className={
        viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"
      }
    >
      {sortedProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  )
}

export default Products
