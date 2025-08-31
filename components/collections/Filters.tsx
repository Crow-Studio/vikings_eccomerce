'use client';
import React, { useState, useEffect } from "react";
import { DBProduct } from "@/types";
interface PriceRange {
  label: string;
  min: number;
  max: number;
}
interface FilterState {
  categories: string[];
  priceRange: PriceRange | null;
}
interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  products: DBProduct[]; 
}
const priceRanges: PriceRange[] = [
  { label: "Under KSh 2,000", min: 0, max: 2000 },
  { label: "KSh 2,000 - 5,000", min: 2000, max: 5000 },
  { label: "KSh 5,000 - 10,000", min: 5000, max: 10000 },
  { label: "KSh 10,000 - 20,000", min: 10000, max: 20000 },
  { label: "Above KSh 20,000", min: 20000, max: Infinity }
];
export default function Filters({ onFilterChange, products }: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(product => product.category.name))
    ).sort();
    setCategories(uniqueCategories);
  }, [products]);
  const handleCategoryChange = (category: string): void => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange({ categories: updated, priceRange: selectedPriceRange });
  };
  const handlePriceChange = (priceRange: PriceRange): void => {
    setSelectedPriceRange(priceRange);
    onFilterChange({ categories: selectedCategories, priceRange });
  };
  const clearAllFilters = (): void => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    onFilterChange({ categories: [], priceRange: null });
  };
  return (
    <div className="space-y-6">
      {}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-800 dark:text-white">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors dark:text-slate-400 dark:group-hover:text-slate-200">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>
      {}
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-800 dark:text-white">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range}
                onChange={() => handlePriceChange(range)}
                className="w-4 h-4 text-slate-600 border-slate-300 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors dark:text-slate-400 dark:group-hover:text-slate-200">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      {}
      <button
        onClick={clearAllFilters}
        className="w-full py-2 px-4 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-800"
      >
        Clear All Filters
      </button>
    </div>
  );
}