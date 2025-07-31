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
  name: string // Human-readable name (e.g., "Small", "Red")
  value: string // Actual value (e.g., "S", "#FF0000")
}

export interface ProductVariant {
  id: string
  title: string // e.g., "Size", "Color"
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
