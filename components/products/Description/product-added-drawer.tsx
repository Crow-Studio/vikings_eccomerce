"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check, ShoppingCart, Shield, Truck, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface ProductAddedDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  quantity: number
}

export const ProductAddedDrawer = React.memo(({ isOpen, onClose, product, quantity }: ProductAddedDrawerProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-muted">
            <h3 id="drawer-title" className="text-lg font-semibold text-foreground">
              Added to Cart
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* Success Message */}
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Item added successfully!</p>
                <p className="text-sm text-green-600 dark:text-green-400">Ready for checkout</p>
              </div>
            </div>
            {/* Product Details */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {/* Replace with actual product image */}
                <div className="w-8 h-8 bg-primary/20 rounded"></div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground line-clamp-2">{product.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {quantity} {quantity > 1 ? "items" : "item"} × KSh {product.price.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-primary mt-1">
                  Total: KSh {(product.price * quantity).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/checkout" className="block" onClick={onClose}>
                <Button className="w-full" size="lg">
                  <ShoppingCart className="w-4 h-4" />
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" onClick={onClose} className="w-full bg-transparent" size="lg">
                Continue Shopping
              </Button>
            </div>
            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t border-muted">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Secure checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Fast delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})
ProductAddedDrawer.displayName = "ProductAddedDrawer"
