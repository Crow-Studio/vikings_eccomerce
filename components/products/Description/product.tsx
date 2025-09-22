"use client"
import React, { useState, useCallback, useEffect } from "react"
import type { DBProduct, Product } from "@/types/products"
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
import ProductUI from "@/components/global/Product"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProductDetailsClientProps {
  product: Product
  moreProducts?: Product[]
}
export function ProductDetailsClient({ product, moreProducts = [] }: ProductDetailsClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([])
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <GrainOverlay/>
      <div className="max-w-7xl mx-auto">
        <ProductHeader product={product} />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-12 mb-12">
          {}
          <div className="lg:sticky lg:top-8 self-start">
            <ImageGallery
              images={product.images}
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
        
        {/* More Products Section */}
        {moreProducts.length > 0 && (
          <div className="mt-16 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                  More Products You Might Like
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Discover more quality items from our collection
                </p>
              </div>
              <Link href="/products">
                <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg px-6 py-2 font-medium text-sm flex items-center gap-2 group transition-all duration-300 shadow-md hover:shadow-lg">
                  View All Products
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
            
            <div className="relative">
              <ProductUI 
                products={moreProducts}
                showPagination={false}
                itemsPerPage={8}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}