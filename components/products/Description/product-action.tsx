"use client"

import * as React from "react"
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductActionsProps {
  quantity: number
  updateQuantity: (newQuantity: number) => void
  handleAddToCart: () => Promise<void>
  isAddingToCart: boolean
  inStock: boolean
  isWishlisted: boolean
  setIsWishlisted: (isWishlisted: boolean) => void
}

export const ProductActions = React.memo(
  ({
    quantity,
    updateQuantity,
    handleAddToCart,
    isAddingToCart,
    inStock,
    isWishlisted,
    setIsWishlisted,
  }: ProductActionsProps) => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity-input" className="text-sm font-medium text-foreground">
          Quantity:
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(quantity - 1)}
            className="w-10 h-10 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span id="quantity-input" className="w-12 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(quantity + 1)}
            className="w-10 h-10 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <Button size="lg" className="flex-1 group" onClick={handleAddToCart} disabled={isAddingToCart || !inStock}>
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-1" />
          )}
          <span className="relative z-10">{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`${isWishlisted ? "text-red-500 border-red-500" : ""}`}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>
      </div>
    </div>
  ),
)
ProductActions.displayName = "ProductActions"
