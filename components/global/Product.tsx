"use client";

import { DBProduct } from "@/types";
import Image from "next/image";
import { Heart } from "lucide-react";
import ProductSkeleton from "./ProductSkeleton";

interface ProductUIProps {
  product?: DBProduct;
  isLoading?: boolean;
}

// Helper function to check if product is new (within last 1 day)
function isNewProduct(createdAt: Date): boolean {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  return createdAt > oneDayAgo;
}

export default function ProductUI({ product, isLoading = false }: ProductUIProps) {
  if (isLoading || !product) {
    return <ProductSkeleton />;
  }

  const isNew = isNewProduct(new Date(product.created_at));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    // TODO: Add wishlist functionality here
    console.log(`Toggle wishlist for product: ${product.id}`);
  };

  return (
    <div className="grid gap-1.5 group cursor-pointer">
      <div className="h-[15rem] rounded-lg overflow-hidden relative transition-shadow duration-300 bg-white shadow shadow-white border border-gray-200 dark:border-slate-700">
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              New
            </span>
          </div>
        )}
        
        {/* Wishlist Icon */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart className="w-3.5 h-3.5 text-gray-600 group-hover/wishlist:text-black group-hover/wishlist:fill-red-500 transition-colors duration-200" />
        </button>
        
        <Image
          src={product.images[0].url}
          alt={`${product.name.toLowerCase()}_${product.images[0].id}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="grid gap-y-1.5">
        <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h4>
        <p className="text-xs text-muted-foreground font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          ksh. {product.price}
        </p>
      </div>
    </div>
  );
}