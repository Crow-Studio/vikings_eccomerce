// Shared type definitions for the collections feature

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  isNew: boolean;
}

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface FilterState {
  categories: string[];
  priceRange: PriceRange | null;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

// Component prop interfaces
export interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
}

export interface ProductsProps {
  filters: FilterState;
  searchQuery: string;
  sortBy: SortBy;
  viewMode: ViewMode;
}

export interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}