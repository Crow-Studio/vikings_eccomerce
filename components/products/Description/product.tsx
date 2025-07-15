"use client"
import { useState, useCallback } from "react"
import GrainOverlay from "@/components/global/GrainOverlay"
import { useCartStore } from "@/store/cart-store"
import { type Product } from "@/types/product"
import { mockProducts } from "@/data/products"


import { ImageGallery } from "@/components/products/Description/image-gallery"
import { ProductAddedDrawer } from "@/components/products/Description/product-added-drawer"
import { ProductHeader } from "@/components/products/Description/product-header"
import { ProductPricing } from "@/components/products/Description/product-pricing"
import { ProductFeatures } from "@/components/products/Description/product-features"
import { ProductActions } from "@/components/products/Description/product-action"
import { ProductTrustBadges } from "@/components/products/Description/product-trust-badges"
import { ProductContactOptions } from "@/components/products/Description/product-contact-option"
import { ProductTabs } from "@/components/products/Description/product-tabs"
import { RelatedProductsSection } from "@/components/products/Description/related-product"

interface ProductDescPageProps {
  params: {
    id: string
  }
}

export default function ProductDescPage({ params }: ProductDescPageProps) {
  const product: Product | undefined = mockProducts.find((p) => p.id.toString() === params.id) || mockProducts[0] as Product

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("description")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const { addItem } = useCartStore()

  const updateQuantity = useCallback((newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }, [])

  const handleAddToCart = useCallback(async () => {
    setIsAddingToCart(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || "/placeholder.svg?height=80&width=80",
    })
    setIsAddingToCart(false)
    setShowDrawer(true)
  }, [addItem, product, quantity])

  const handleTabChange = useCallback((tabId: string) => {
    setSelectedTab(tabId)
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 relative">
        <GrainOverlay />
        <p className="text-foreground text-xl">Product not found.</p>
      </div>
    )
  }

  const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-primary/5 relative">
      <GrainOverlay />
      <div className="max-w-7xl mx-auto">
        <ProductHeader product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div>
            <ImageGallery
              images={product.images}
              currentIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
            />
          </div>
          {/* Product Info */}
          <div className="space-y-6">
            <ProductPricing price={product.price} originalPrice={product.originalPrice} />
            <ProductFeatures features={product.features} />
            <ProductActions
              quantity={quantity}
              updateQuantity={updateQuantity}
              handleAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
              inStock={product.inStock}
              isWishlisted={isWishlisted}
              setIsWishlisted={setIsWishlisted}
            />
            <ProductTrustBadges />
            <ProductContactOptions />
          </div>
        </div>

        <ProductTabs product={product} selectedTab={selectedTab} onTabChange={handleTabChange} />
        <RelatedProductsSection relatedProducts={relatedProducts} />
      </div>

      <ProductAddedDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  )
}
