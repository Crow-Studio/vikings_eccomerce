import * as React from "react"
import { Badge } from "./badge"

interface ProductPricingProps {
  price: number
  originalPrice?: number
}

export const ProductPricing = React.memo(({ price, originalPrice }: ProductPricingProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className="flex items-center gap-4">
      <div className="text-3xl font-bold text-primary">KSh {price.toLocaleString()}</div>
      {originalPrice && (
        <div className="flex items-center gap-2">
          <span className="text-lg text-muted-foreground line-through">KSh {originalPrice.toLocaleString()}</span>
          <Badge variant="warning">-{discount}%</Badge>
        </div>
      )}
    </div>
  )
})
ProductPricing.displayName = "ProductPricing"
