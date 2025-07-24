export type ProductImage = {
  id: string
  product_id: string
  url: string
  created_at: string
  updated_at: string
}

export type ProductCategory = {
  id: string
  name: string
  created_at: string
}

export type ProductVariantGenerated = {
  id: string
  variant_id: string
  name: string
  value: string // e.g., "S", "#FF0000", "Leather"
}

export type ProductVariant = {
  id: string
  product_id: string
  title: string // e.g., "Size", "Color", "Material"
  generatedVariants: ProductVariantGenerated[]
}

export type Product = {
  id: string
  name: string
  price: string
  description: string
  visibility: "active" | "inactive"
  category_id: string
  has_variants: boolean
  created_at: string
  updated_at: string
  category: ProductCategory
  images: ProductImage[]
  variants: ProductVariant[]
}
