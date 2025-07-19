import * as React from "react"
import { Check } from "lucide-react"

interface ProductFeaturesProps {
  features?: string[]
}

export const ProductFeatures = React.memo(({ features }: ProductFeaturesProps) => {
  if (!features || features.length === 0) return null

  return (
    <div className="bg-muted/30 rounded-xl p-4">
      <h3 className="font-semibold mb-3 text-foreground">Key Features</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
})
ProductFeatures.displayName = "ProductFeatures"
