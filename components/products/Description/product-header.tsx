import * as React from "react"
import Link from "next/link"
import { Badge } from "./badge"
import { ReviewSummary } from "./review-summary"
import type { Product } from "@/types/product"

interface ProductHeaderProps {
  product: Product
}

export const ProductHeader = React.memo(({ product }: ProductHeaderProps) => (
  <>
    {/* Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <span>/</span>
      <Link href="/products" className="hover:text-foreground transition-colors">
        Products
      </Link>
      <span>/</span>
      <span className="text-foreground">{product.category}</span>
    </nav>

    {/* Product Info */}
    <div>
      <div className="flex items-center gap-2 mb-2">
        {product.isNew && <Badge variant="primary">New</Badge>}
        <Badge variant={product.inStock ? "success" : "default"}>{product.inStock ? "In Stock" : "Out of Stock"}</Badge>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
      <div className="flex items-center gap-4 mb-4">
        <ReviewSummary rating={product.rating} totalReviews={product.reviews} />
        <span className="text-sm text-muted-foreground">SKU: {product.sku || `VKG-${product.id}`}</span>
      </div>
    </div>
  </>
))
ProductHeader.displayName = "ProductHeader"
