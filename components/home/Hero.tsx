import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductUI from "@/components/global/Product";
import GrainOverlay from "@/components/global/GrainOverlay";
import { Product } from "@/types/products";

interface VikingsHeroProps {
  products: Product[];
}


export default function VikingsHero({ products }: VikingsHeroProps) {
  const featuredProducts = products.slice(0, 5);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <GrainOverlay />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Featured Products */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                Handpicked quality items for professionals and enthusiasts
              </p>
            </div>
            <Link href="/products">
              <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-6 py-2 font-medium text-sm flex items-center gap-2 group transition-all duration-300 shadow-md hover:shadow-lg">
                View All Products
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="relative">
            <ProductUI 
              products={featuredProducts} 
              showPagination={false}
              itemsPerPage={5}
            />
          </div>
        </div>

        {/* Divider Line */}
        <div className="pt-8 border-t border-gray-200"></div>
      </div>
    </div>
  );
}