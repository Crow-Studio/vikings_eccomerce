"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: string
  }
  quantity: number
  selectedVariants: Record<string, string>
  inStock: boolean
}

export const ProductActions = React.memo(
  ({
    product,
    quantity,
    selectedVariants,
    inStock,
  }: ProductActionsProps) => {
    const whatsappNumber = "+254729016371"
    const handleWhatsAppOrder = () => {
      const variantsText = Object.entries(selectedVariants)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")

      const message = `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: KSh ${Number.parseFloat(
        product.price
      ).toLocaleString()}\nQuantity: ${quantity}${
        variantsText ? `\n\nSelected Options:\n${variantsText}` : ""
      }\n\nPlease provide more details about availability and delivery.`

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`
      window.open(whatsappUrl, "_blank")
    }

    return (
      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full bg-white text-black backdrop-blur-sm border border-gray-200 shadow-sm dark:text-white transition-colors duration-200"
          onClick={handleWhatsAppOrder}
          disabled={!inStock}
        >
          {inStock ? "Order via WhatsApp" : "Out of Stock"}
        </Button>
      </div>
    )
  }
)

ProductActions.displayName = "ProductActions"
