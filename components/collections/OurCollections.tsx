'use client'

import React, { useState } from "react";
import Filters from "./Filters";
import Products from "./Products";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, X } from "lucide-react";

export default function OurCollections() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="min-h-screen bg-[#fcfcfc]">
      <div className="container mx-auto p-4 sm:p-6 lg:p-10">
        <div className="mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Our Collections
          </h3>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Discover our curated selection</p>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Filter size={18} />
            <span className="font-medium">Filters</span>
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-auto lg:h-[calc(100vh-200px)]">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div className="fixed inset-y-0 left-0 w-full sm:w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-800 text-lg">Filters</h4>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ScrollArea className="h-[calc(100vh-80px)]">
                  <div className="p-4">
                    <Filters />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-800 text-lg">Filters</h4>
                  <p className="text-sm text-slate-500 mt-1">Refine your search</p>
                </div>
                
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="p-6">
                    <Filters />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1 min-w-0">
            <div className="lg:h-full">
              <ScrollArea className="h-auto lg:h-full">
                <div className="lg:pr-4">
                  <Products />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}