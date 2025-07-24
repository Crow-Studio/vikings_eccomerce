"use client"

import type React from "react"
import ShoppingBagIcon from "../svgs/shoppingBag"
import ProductUI from "../global/Product"
import { DBProduct } from "@/types"

interface ProductsComponentProps {
  products?: DBProduct[]; // Make products prop optional
  filters: {
    categories: string[];
    priceRange?: { min: number; max: number };
  };
  searchQuery: string;
  sortBy: string;
  viewMode: string;
}

const Products: React.FC<ProductsComponentProps> = ({ 
  products = [], // Default to empty array
  filters, 
  searchQuery, 
  sortBy, 
  viewMode 
}) => {
  const filteredProducts = products.filter((product: DBProduct) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = 
      filters.categories.length === 0 || 
      filters.categories.includes(product.category.name)

    // Convert price string back to number for comparison
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const matchesPrice =
      !filters.priceRange || 
      (priceValue >= filters.priceRange.min && priceValue <= filters.priceRange.max)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a: DBProduct, b: DBProduct) => {
    // Convert price strings to numbers for sorting
    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));

    switch (sortBy) {
      case "price-low":
        return priceA - priceB
      case "price-high":
        return priceB - priceA
      case "rating":
        // Since DBProduct doesn't have rating, you might want to add it or use a default
        return 0
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

  // Use viewMode to determine grid layout - Updated to 4 columns for large screens
  const gridClasses = viewMode === 'list' 
    ? "grid grid-cols-1 gap-5"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";

  return (
    <div className={gridClasses}>
      {sortedProducts.map((product: DBProduct) => (
        <ProductUI key={product.id} product={product} />
      ))}
    </div>
  )
}

export default Products