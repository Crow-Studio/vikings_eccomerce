"use client"
import type React from "react"
import ShoppingBagIcon from "../svgs/shoppingBag"
import ProductUI from "../global/Product"
import { DBProduct } from "@/types/products"

interface ProductsComponentProps {
  products?: DBProduct[]; 
  filters: {
    categories: string[];
    priceRange?: { min: number; max: number };
  };
  searchQuery: string;
  sortBy: string;
  viewMode: string;
  onClearFilters?: () => void; // Added this missing prop
}

const Products: React.FC<ProductsComponentProps> = ({ 
  products = [], 
  filters, 
  searchQuery, 
  sortBy, 
  viewMode,
  onClearFilters 
}) => {
  const filteredProducts = products.filter((product: DBProduct) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      filters.categories.length === 0 || 
      filters.categories.includes(product.category.name)
    
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const matchesPrice =
      !filters.priceRange || 
      (priceValue >= filters.priceRange.min && priceValue <= filters.priceRange.max)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a: DBProduct, b: DBProduct) => {
    const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
    const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
    
    switch (sortBy) {
      case "price-low":
        return priceA - priceB
      case "price-high":
        return priceB - priceA
      case "rating":
        return 0
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-blue-50 rounded-full">
            <ShoppingBagIcon className="w-16 h-16 text-blue-300" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No products found
        </h3>
        <p className="text-gray-600 text-lg mb-1">
          No products match your current criteria.
        </p>
        <p className="text-gray-500 mt-2">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  const gridClasses = viewMode === 'list' 
    ? "grid grid-cols-1 gap-5"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5";

  return (
    <div className="space-y-6">
      {/* Results summary with blue accent */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          <div>
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{sortedProducts.length}</span> products
              {searchQuery && (
                <span> for &quot;<span className="font-medium text-gray-800">{searchQuery}</span>&quot;</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Clear filters if any active */}
        {(filters.categories.length > 0 || filters.priceRange || searchQuery) && onClearFilters && (
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            onClick={onClearFilters}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products grid */}
      <div className={gridClasses}>
        {sortedProducts.map((product: DBProduct) => (
          <ProductUI key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Products