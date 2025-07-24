"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { ProductVariant, ProductVariantGenerated } from "@/types/products"

interface ProductVariantsProps {
  variants: ProductVariant[]
  selectedVariants: Record<string, string>
  onVariantChange: (variantTitle: string, value: string) => void
}

export const ProductVariants = React.memo(({ variants, selectedVariants, onVariantChange }: ProductVariantsProps) => {
  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <div key={variant.id} className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">{variant.title}:</h3>
          <div className="flex flex-wrap gap-2">
            {variant.generatedVariants.map((option: ProductVariantGenerated) => {
              const isSelected = selectedVariants[variant.title] === option.value

              return (
                <button
                  key={option.id}
                  onClick={() => onVariantChange(variant.title, option.value)}
                  className={cn(
                    "flex items-center justify-center rounded-md border text-sm font-medium transition-colors",
                    "px-4 py-2", // Consistent padding for all variant types
                    isSelected
                      ? "border-primary ring-2 ring-primary"
                      : "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  )}
                  aria-pressed={isSelected}
                  aria-label={`${variant.title} ${option.name}`}
                >
                  {option.name} {/* Always display the human-readable name */}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
})
ProductVariants.displayName = "ProductVariants"
