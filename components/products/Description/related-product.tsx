import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewSummary } from "./review-summary"
import type { Product } from "@/types/product"

interface RelatedProductsSectionProps {
  relatedProducts: Product[]
}

export const RelatedProductsSection = React.memo(({ relatedProducts }: RelatedProductsSectionProps) => {
  if (relatedProducts.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Related Products</h2>
        <Link href="/products">
          <Button variant="outline">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct) => (
          <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
            <div className="group bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-all duration-300 cursor-pointer">
              <div className="aspect-square bg-background rounded-lg mb-4 flex items-center justify-center">
                {/* Replace with actual product image */}
                <div className="w-16 h-16 bg-primary/20 rounded-lg"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {relatedProduct.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <ReviewSummary rating={relatedProduct.rating} totalReviews={0} />
              </div>
              <div className="text-lg font-bold text-primary">KSh {relatedProduct.price.toLocaleString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
})
RelatedProductsSection.displayName = "RelatedProductsSection"
