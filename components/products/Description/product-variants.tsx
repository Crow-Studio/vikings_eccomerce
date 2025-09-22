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
  const uniqueVariants = React.useMemo(() => {
    const seen = new Set<string>()
    return variants.filter((variant) => {
      const key = variant.title.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return variant.generatedVariants && variant.generatedVariants.length > 0
    })
  }, [variants])
  const getUniqueVariantOptions = React.useCallback((options: ProductVariantGenerated[]) => {
    const seen = new Set<string>()
    return options.filter((option) => {
      const key = `${option.value}-${option.name}`.toLowerCase()
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }, [])
  if (uniqueVariants.length === 0) {
    return null
  }
  return (
    <div className="space-y-6">
      {uniqueVariants.map((variant) => {
        const uniqueOptions = getUniqueVariantOptions(variant.generatedVariants)
        if (uniqueOptions.length === 0) {
          return null
        }
        return (
          <div key={variant.id} className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              {variant.title}:
              {selectedVariants[variant.title] && (
                <span className="ml-2 text-muted-foreground font-normal">
                  {uniqueOptions.find(opt => opt.value === selectedVariants[variant.title])?.name}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {uniqueOptions.map((option: ProductVariantGenerated) => {
                const isSelected = selectedVariants[variant.title] === option.value
                return (
                  <button
                    key={`${variant.id}-${option.id}`}
                    onClick={() => onVariantChange(variant.title, option.value)}
                    className={cn(
                      "flex items-center justify-center rounded-xl border text-sm font-medium transition-colors",
                      "px-4 py-2 min-w-[60px]", 
                      isSelected
                        ? "border-blue-200 bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2"
                        : "border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200 text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-pressed={isSelected}
                    aria-label={`Select ${variant.title}: ${option.name}`}
                    type="button"
                  >
                    {option.name}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
})
ProductVariants.displayName = "ProductVariants"