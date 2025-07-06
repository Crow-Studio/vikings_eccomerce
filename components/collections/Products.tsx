'use client';

import React, { useState } from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import ShoppingBagIcon from "../svgs/shoppingBag";
import { mockProducts } from "../../data/products";
import type { 
  Product, 
  ProductCardProps, 
  ProductsProps, 
} from '@/types/product';

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToCart = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 p-6 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
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
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"}
                />
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
              
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  product.inStock
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={16} />
                )}
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background rounded-xl shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-[#f3f2f3] dark:bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
        
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
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
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-slate-800 dark:text-white">
            KSh {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-md'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
          }`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingCart size={16} />
          )}
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

const Products: React.FC<ProductsProps> = ({ filters, searchQuery, sortBy, viewMode }) => {
  const filteredProducts = mockProducts.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.categories.length === 0 || 
                           filters.categories.includes(product.category);
    
    const matchesPrice = !filters.priceRange || 
                        (product.price >= filters.priceRange.min && 
                         product.price <= filters.priceRange.max);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return Number(b.isNew) - Number(a.isNew);
      default:
        return 0;
    }
  });

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 flex justify-center">
          <ShoppingBagIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
        <p className="text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {sortedProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default Products;