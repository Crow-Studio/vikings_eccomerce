'use client'
import React, { useState } from "react";
import { Filter, X, Search, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Filters from "./Filters";
import Products from "./Products";
import GrainOverlay from '@/components/global/GrainOverlay';
import { FilterState, SortBy } from "@/types/products";
import { DBProduct } from "@/types"; 

interface OurCollectionsProps {
  products?: DBProduct[]; 
}

export default function OurCollections({ products = [] }: OurCollectionsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ categories: [], priceRange: null });

  const pathname = usePathname();
  const isProductsPage = pathname === '/products';
  const title = isProductsPage ? 'Our Products' : 'Our Collections';

  const normalizedFilters = {
    categories: filters.categories,
    priceRange: filters.priceRange || undefined
  };

  return (
    <section className="min-h-screen relative bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <GrainOverlay/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">
            Discover quality tools and equipment from Vikings Kenya Power Traders
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between ">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white bg-white"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none bg-white dark:bg-black border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {/* Mobile Filter Button - Blue */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white/70 backdrop-blur-sm dark:bg-background rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 p-6 sticky top-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Refine your search</p>
              </div>
              <Filters onFilterChange={setFilters} products={products} />
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-background shadow-xl transform transition-transform" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Refine your search</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600 dark:text-slate-400" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto h-full">
                  <Filters onFilterChange={setFilters} products={products} />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <Products 
              products={products}
              filters={normalizedFilters}
              searchQuery={searchQuery}
              sortBy={sortBy}
              viewMode="grid"
            />
          </div>
        </div>
      </div>
    </section>
  );
}