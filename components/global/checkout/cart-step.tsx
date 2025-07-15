"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"

interface CartStepProps {
  setCurrentStep: (step: number) => void
}

export const CartStep = React.memo(({ setCurrentStep }: CartStepProps) => {
  const { items, updateQuantity, removeItem } = useCartStore()

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Your Cart</h2>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <svg className="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-background rounded-lg mb-4 hover:bg-muted/20 transition-colors"
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">KSh {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <Button onClick={() => setCurrentStep(2)} className="w-full">
          Continue to Details
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
})
CartStep.displayName = "CartStep"
