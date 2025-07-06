'use client'

import React, { useState } from "react";
import { Filter, X, Search, Grid, List, ChevronDown } from "lucide-react";
import Filters from "./Filters";
import Products from "./Products";
import GrainOverlay from '@/components/global/GrainOverlay';
import type { FilterState, ViewMode, SortBy } from '@/types/product';

export default function OurCollections() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ categories: [], priceRange: null });

  return (
    <section className="min-h-screen bg-[#fcfcfc] dark:bg-[#1d1d1d] relative overflow-hidden">
      <GrainOverlay/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:text-white">
            Our Collections
          </h1>
          <p className="text-slate-600 dark:text-muted-foreground mt-2">
            Discover quality tools and equipment from Vikings Kenya Power Traders
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-background rounded-2xl shadow-lg border border-slate-200/60 dark:border-zinc-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none dark:text-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              </div>

              {/* View Mode */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white dark:bg-background rounded-2xl shadow-lg border border-slate-200/60 dark:border-zinc-700 p-6 sticky top-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Filters</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Refine your search</p>
              </div>
              <Filters onFilterChange={setFilters} />
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-background shadow-xl transform transition-transform" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Filters</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Refine your search</p>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto h-full">
                  <Filters onFilterChange={setFilters} />
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            <Products 
              filters={filters}
              searchQuery={searchQuery}
              sortBy={sortBy}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}