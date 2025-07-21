"use client"

import { memo, useCallback } from "react"
import { Plus, Minus, X } from "lucide-react"
import type { CartItemProps } from "@/types/header"

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
      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="w-8 h-8 bg-primary/20 rounded"></div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
        <p className="text-sm text-muted-foreground">KSh {item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleDecrease}
            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors text-red-600 self-start"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
})

CartItem.displayName = "CartItem"
