import * as React from "react"

interface ProductPricingProps {
  price: number
}

export const ProductPricing = React.memo(({ price }: ProductPricingProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-3xl font-bold text-primary">KSh {price.toLocaleString()}</div>
    </div>
  )
})
ProductPricing.displayName = "ProductPricing"
