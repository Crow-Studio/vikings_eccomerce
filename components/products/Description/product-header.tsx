import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/products/Description/badge"
import type { Product } from "@/types/products"

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
      <span className="text-foreground">{product.category.name}</span>
    </nav>

    {/* Product Info */}
    <div>
      <Badge variant={product.visibility === "active" ? "success" : "default"}>
        {product.visibility === "active" ? "In Stock" : "Out of Stock"}
      </Badge>
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 mt-2">{product.name}</h1>
    </div>
  </>
))
ProductHeader.displayName = "ProductHeader"
