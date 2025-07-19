export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  isNew: boolean
  inStock: boolean
  rating: number
  reviews: number
  sku?: string
  category: string
  images?: string[]
  features?: string[]
  specifications?: Record<string, string>
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