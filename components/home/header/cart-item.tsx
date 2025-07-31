"use client"
import { memo, useCallback } from "react"
import { Plus, Minus, X } from "lucide-react"
import type { CartItemProps } from "@/types/header"
import Image from "next/image" // Import Image component

export const CartItem = memo(({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const handleDecrease = useCallback(() => {
    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
  }, [item.id, item.quantity, onUpdateQuantity])

  const handleIncrease = useCallback(() => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }, [item.id, item.quantity, onUpdateQuantity])

  const handleRemove = useCallback(() => {
    onRemove(item.id)
  }, [item.id, onRemove])

  return (
    <div className="flex gap-4 p-3 bg-muted/30 rounded-lg">
      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg?height=64&width=64&query=cart item"} // Use item.image
          alt={item.name}
          width={64}
          height={64}
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {Object.entries(item.selectedVariants)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
        )}
        <p className="text-sm text-muted-foreground">KSh {item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleDecrease}
            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors text-red-600 self-start"
        aria-label={`Remove ${item.name} from cart`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
})
CartItem.displayName = "CartItem"
