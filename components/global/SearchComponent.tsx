"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import Link from "next/link";
import Image from "next/image";

interface MegaSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaSearch = ({ isOpen, onClose }: MegaSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { searchResults, isLoading, total, error, searchProducts, clearSearch } = useSearch();

  const popularCategories = [
    { name: "Power Tools", count: "150+ items", href: "/products?category=power-tools" },
    { name: "Garden Tools", count: "80+ items", href: "/products?category=garden-tools" },
    { name: "Generators", count: "25+ items", href: "/products?category=generators" },
    { name: "Safety Equipment", count: "40+ items", href: "/products?category=safety" },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    } else {
      clearSearch();
    }
  }, [searchQuery, searchProducts, clearSearch]);

  // Save search to recent searches
  const saveToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle escape key and body scroll
  useEffect(() => {
    interface KeyboardEvent {
      key: string;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Search Container */}
      <div className="relative w-full max-w-4xl mx-3 sm:mx-4 bg-background/95 backdrop-blur-md dark:bg-background/95 rounded-2xl shadow-2xl border border-border max-h-[85vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-top-4 duration-300">
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    saveToRecentSearches(searchQuery.trim());
                  }
                }}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-lg transition-all duration-200"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground animate-spin" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-200 shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Search Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-100px)] sm:max-h-[calc(80vh-120px)]">
          {searchQuery.trim() ? (
            // Search Results
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Search Results
                </h3>
                <span className="text-sm text-muted-foreground">
                  {total} results found
                </span>
              </div>
              
              {error && (
                <div className="text-center py-4 mb-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-all duration-200 group"
                      onClick={() => {
                        onClose();
                        saveToRecentSearches(searchQuery.trim());
                      }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{product.category_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          ${product.price.toFixed(2)}
                        </p>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-auto mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : !isLoading && searchQuery.trim() ? (
                <div className="text-center py-8 sm:py-12">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search terms or browse our categories
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            // Default Content (Recent + Categories)
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="px-3 py-2 bg-muted/50 text-foreground rounded-lg hover:bg-muted transition-colors duration-200 text-sm border border-border hover:border-primary/50"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Categories */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                  Browse Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularCategories.map((category, index) => (
                    <Link
                      key={index}
                      href={category.href}
                      onClick={onClose}
                      className="p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 text-left group border border-border hover:border-primary/50 hover:scale-[1.02]"
                    >
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{category.count}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaSearch;
