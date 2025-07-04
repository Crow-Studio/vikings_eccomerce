"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";

interface MegaSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
}


const MegaSearch = ({ isOpen, onClose }: MegaSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search - replace with actual search logic
  useEffect(() => {
    if (searchQuery.trim()) {
      // TODO: Implement actual search logic here
      // Example: searchProducts(searchQuery).then(setSearchResults);
      setSearchResults([]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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
                placeholder="Search for tools, equipment, parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-lg transition-all duration-200"
              />
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
                  {searchResults.length} results found
                </span>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-muted/50 rounded-lg cursor-pointer transition-all duration-200 group"
                      onClick={() => {
                        onClose();
                        // Navigate to product
                      }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base">
                          {product.price}
                        </p>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-auto mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Try adjusting your search terms or browse our categories
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Default Content (Recent + Trending)
            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
              {/* Recent Searches */}
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

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    Trending Searches
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-primary/5 to-primary/10 text-foreground rounded-lg hover:from-primary/10 hover:to-primary/20 transition-all duration-200 text-sm font-medium border border-border hover:border-primary/50 hover:scale-105"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
                  Browse Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Power Tools", count: "150+ items" },
                    { name: "Garden Tools", count: "80+ items" },
                    { name: "Generators", count: "25+ items" },
                    { name: "Welding Equipment", count: "40+ items" },
                  ].map((category, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onClose();
                        // Navigate to category
                      }}
                      className="p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200 text-left group border border-border hover:border-primary/50 hover:scale-[1.02]"
                    >
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{category.count}</p>
                    </button>
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