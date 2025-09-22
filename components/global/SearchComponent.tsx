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

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
    } else {
      clearSearch();
    }
  }, [searchQuery, searchProducts, clearSearch]);

  const saveToRecentSearches = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="relative w-full max-w-4xl mx-3 sm:mx-4 bg-white/95 backdrop-blur-md dark:bg-background/95 rounded-2xl shadow-2xl border border-gray-200 dark:border-border max-h-[85vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-muted/50 border border-gray-300 dark:border-border rounded-xl text-gray-900 dark:text-foreground placeholder-gray-500 dark:placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-lg transition-all duration-200"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-muted/50 rounded-lg transition-colors duration-200 shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-100px)] sm:max-h-[calc(80vh-120px)]">
          {searchQuery.trim() ? (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  Search Results
                </h3>
                <span className="text-sm text-blue-600 font-medium">
                  {total} results found
                </span>
              </div>

              {error && (
                <div className="text-center py-4 mb-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-muted/50 rounded-lg cursor-pointer transition-all duration-200 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                      onClick={() => {
                        onClose();
                        saveToRecentSearches(searchQuery.trim());
                      }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-muted/50 flex items-center justify-center shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-foreground group-hover:text-blue-600 transition-colors duration-200 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">{product.category_name}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-red-600 text-sm sm:text-base">
                          KSh {product.price.toFixed(2)}
                        </p>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 ml-auto mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : !isLoading && searchQuery.trim() ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm mb-6">
                    Try adjusting your search terms or browse our categories
                  </p>     
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-foreground">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        className="px-3 py-2 bg-gray-100 dark:bg-muted/50 text-gray-700 dark:text-foreground rounded-lg hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 transition-colors duration-200 text-sm border border-gray-200 dark:border-border hover:border-blue-300 dark:hover:border-blue-600"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State Message */}
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-foreground mb-2">
                  Start searching
                </h3>
                <p className="text-gray-600 dark:text-muted-foreground text-sm">
                  Enter a product name or category to find what you&apos;re looking for
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaSearch;