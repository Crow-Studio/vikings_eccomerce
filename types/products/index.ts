import { Category, GeneratedVariants, ProductImage, Visibility } from "@/database/schema";
export type SortBy = 'featured' | 'newest' | 'price-low' | 'price-high';
export interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
}
export interface ProductVariantGenerated extends GeneratedVariants {
  value: string;
}
export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  generatedVariants: ProductVariantGenerated[];
}
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  visibility: Visibility;
  category_id: string;
  has_variants: boolean;
  created_at: Date;
  updated_at: Date;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}
export interface DBProduct {
  visibility: Visibility;
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date | null;
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
export type RawDBProduct = DBProduct;
export function transformDBProductToProduct(dbProduct: DBProduct): DBProduct {
  return {
    ...dbProduct,
    variants: dbProduct.variants.map(variant => ({
      ...variant,
      generatedVariants: variant.generatedVariants.map(gv => ({
        ...gv,
        value: gv.name
      }))
    }))
  };
}
export { Visibility };