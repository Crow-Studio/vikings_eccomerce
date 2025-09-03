"use client"
import React, { useState, useCallback, useEffect } from "react"
import type { Product } from "@/types/products"
import { getRelatedProducts } from "@/actions/product-actions" 
import { ImageGallery } from "@/components/products/Description/image-gallery"
import { ProductHeader } from "@/components/products/Description/product-header"
import { ProductPricing } from "@/components/products/Description/product-pricing"
import { ProductActions } from "@/components/products/Description/product-action"
import { ProductTabs } from "@/components/products/Description/product-tabs"
import { RelatedProductsSection } from "@/components/products/Description/related-product"
import { ProductVariants } from "@/components/products/Description/product-variants"
import { ProductTrustBadges } from "@/components/products/Description/product-trust-badges"
import { Card, CardContent } from "@/components/ui/card"
import GrainOverlay from "@/components/global/GrainOverlay"
interface ProductDetailsClientProps {
  product: Product
}
export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [, setIsLoadingRelated] = useState(true)
  const initialSelectedVariants = product.variants.reduce(
    (acc, variant) => {
      if (variant.generatedVariants.length > 0) {
        acc[variant.title] = variant.generatedVariants[0].value
      }
      return acc
    },
    {} as Record<string, string>,
  )
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(initialSelectedVariants)
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoadingRelated(true)
        const products = await getRelatedProducts(product.id, product.category_id)
        setRelatedProducts(products)
      } catch (error) {
        console.error('Error fetching related products:', error)
        setRelatedProducts([])
      } finally {
        setIsLoadingRelated(false)
      }
    }
    fetchRelatedProducts()
  }, [product.category_id, product.id])
  const handleVariantChange = useCallback((variantTitle: string, value: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantTitle]: value }))
  }, [])
  const handleTabChange = useCallback((tabId: string) => {
    setSelectedTab(tabId)
  }, [])
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      <GrainOverlay/>
      <div className="max-w-7xl mx-auto">
        <ProductHeader product={product} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 mb-12">
          {}
          <div className="lg:sticky lg:top-8 self-start">
            <ImageGallery
              images={product.images.map((img) => img.url)}
              currentIndex={currentImageIndex}
              onImageChange={setCurrentImageIndex}
            />
          </div>
          {}
          <div className="space-y-6">
            <Card className="p-6 bg-white border border-blue-100 rounded-2xl shadow-lg">
              <CardContent className="p-0 space-y-4">
                <ProductPricing price={Number.parseFloat(product.price)} />
                {product.has_variants && product.variants.length > 0 && (
                  <ProductVariants
                    variants={product.variants}
                    selectedVariants={selectedVariants}
                    onVariantChange={handleVariantChange}
                  />
                )}
                <ProductActions
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price
                  }}
                  quantity={quantity}
                  selectedVariants={selectedVariants}
                  inStock={product.visibility === "active"}
                />
              </CardContent>
            </Card>
            {}
            <ProductTrustBadges />
          </div>
        </div>
        <ProductTabs product={product} selectedTab={selectedTab} onTabChange={handleTabChange} />
        <RelatedProductsSection 
          relatedProducts={relatedProducts} 
        />
      </div>
    </div>
  )
}