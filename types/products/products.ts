export interface ProductImage {
  id: string
  url: string
  alt: string
}
export interface ProductCategory{
  id: string
  name: string
}
export interface ProductVariantGenerated {
  id: string
  name: string 
  value: string 
}
export interface ProductVariant {
  id: string
  title: string 
  generatedVariants: ProductVariantGenerated[]
}
export interface Product {
  id: string
  name: string
  description: string
  price: string
  images: ProductImage[]
  category: ProductCategory
  visibility: "active" | "inactive"
  variants: ProductVariant[]
}
