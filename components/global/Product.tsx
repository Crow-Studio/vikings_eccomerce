"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import type * as React from "react"
import Image from "next/image"
import Link from "next/link"
import ProductSkeleton from "./ProductSkeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { DBProduct } from "@/types"

interface ProductUIProps {
  products?: DBProduct[]
  product?: DBProduct
  isLoading?: boolean
  itemsPerPage?: number
  showPagination?: boolean
}

// Helper function to check if product is new (within last 1 day)
function isNewProduct(createdAt: Date): boolean {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  return createdAt > oneDayAgo
}

// Individual Product Card Component
function ProductCard({ product }: { product: DBProduct }) {
  const isNew = isNewProduct(new Date(product.created_at))
  const whatsappNumber = "+254729016371"

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault() 
    e.stopPropagation()

    const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: KSh ${Number.parseFloat(product.price).toLocaleString()}\n\nPlease let me know about availability and delivery details.`
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
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
          <Image
            src={product.images[0]?.url || "/placeholder.svg?height=240&width=240&text=Product Image"}
            alt={`${product.name.toLowerCase()}_${product.images[0]?.id}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3 grid sm:group-hover:grid gap-y-1.5 sm:hidden transition-all duration-200">
            <button
              onClick={handleWhatsAppOrder}
              className="p-0.5 rounded-md w-full bg-white/90 backdrop-blur-sm border border-gray-200 group/whatsapp shadow-sm dark:text-black hover:bg-zinc-200 cursor-pointer transition-colors duration-200"
              aria-label="Order via WhatsApp"
            >
              Order via WhatsApp
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

export default function ProductUI({ 
  products, 
  product, 
  isLoading = false, 
  itemsPerPage = 12,
  showPagination = true 
}: ProductUIProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Handle single product case (original behavior)
  if (product && !products) {
    if (isLoading) {
      return <ProductSkeleton />
    }
    return <ProductCard product={product} />
  }

  // Handle multiple products case with pagination
  if (!products) {
    return <ProductSkeleton />
  }

  // Calculate pagination values
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 2

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : currentProducts.map((productItem) => (
              <ProductCard key={productItem.id} product={productItem} />
            ))
        }
      </div>

      {/* Pagination - Only show if enabled and there are products and more than one page */}
      {!isLoading && showPagination && products.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={cn(
                    "cursor-pointer",
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={cn(
                    "cursor-pointer",
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Results Info */}
      {!isLoading && showPagination && products.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} products
        </div>
      )}

      {/* No products message */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  )
}