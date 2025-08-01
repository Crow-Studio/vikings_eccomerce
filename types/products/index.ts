import { Category, GeneratedVariants, ProductImage, Visibility } from "@/database/schema";

// Filter and Sort types
export type SortBy = 'featured' | 'newest' | 'price-low' | 'price-high';

export interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
}

// Extended GeneratedVariants to include the 'value' field expected by components
export interface ProductVariantGenerated extends GeneratedVariants {
  value: string; // This will map to the 'name' field from the database
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  generatedVariants: ProductVariantGenerated[];
}

// Product interface that matches what components expect (with string dates)
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  visibility: Visibility;
  category_id: string;
  has_variants: boolean;
  created_at: string;
  updated_at: string; // Always string, never null
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

// Database product type - what actually comes from the database (with Date objects)
// This should be used for all database queries and component props
export interface DBProduct {
  visibility: Visibility;
  id: string;
  name: string;
  created_at: Date; // Database returns Date objects
  updated_at: Date | null; // Database returns Date objects or null
  price: string;
  description: string;
  category_id: string;
  has_variants: boolean;
  category: Category;
  images: ProductImage[];
  variants: {
    id: string;
    product_id: string;
    title: string;
    generatedVariants: GeneratedVariants[];
  }[];
}

// Raw database query result type - use this for component props that receive raw DB data
// This is actually the same as DBProduct now for consistency
export type RawDBProduct = DBProduct;

// Utility function to transform DB product to component-ready product
export function transformDBProductToProduct(dbProduct: DBProduct): Product {
  return {
    ...dbProduct,
    created_at: dbProduct.created_at.toISOString(),
    updated_at: dbProduct.updated_at ? dbProduct.updated_at.toISOString() : dbProduct.created_at.toISOString(),
    variants: dbProduct.variants.map(variant => ({
      ...variant,
      generatedVariants: variant.generatedVariants.map(gv => ({
        ...gv,
        value: gv.name // Map database 'name' field to component-expected 'value'
      }))
    }))
  };
}

// Export types
export { Visibility };