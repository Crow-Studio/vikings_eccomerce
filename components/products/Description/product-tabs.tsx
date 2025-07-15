"use client"

import * as React from "react"
import { TabButton } from "@/components/products/Description/tab-button"
import { ReviewSummary } from "./review-summary"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

interface ProductTabsProps {
  product: Product
  selectedTab: string
  onTabChange: (tabId: string) => void
}

export const ProductTabs = React.memo(({ product, selectedTab, onTabChange }: ProductTabsProps) => (
  <div className="mb-12">
    <div className="border-b border-muted mb-6">
      <nav className="flex space-x-8" role="tablist">
        <TabButton
          id="description"
          label="Description"
          isActive={selectedTab === "description"}
          onClick={onTabChange}
        />
        <TabButton
          id="specifications"
          label="Specifications"
          isActive={selectedTab === "specifications"}
          onClick={onTabChange}
        />
        <TabButton id="reviews" label="Reviews" isActive={selectedTab === "reviews"} onClick={onTabChange} />
      </nav>
    </div>
    <div className="bg-muted/30 rounded-xl p-6">
      {selectedTab === "description" && (
        <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" className="prose max-w-none">
          <p className="text-foreground leading-relaxed mb-4">
            {product.name} is designed for both professional contractors and DIY enthusiasts who demand reliability and
            performance. This versatile tool combines power, precision, and durability in a compact design that&apos;s
            perfect for a wide range of applications.
          </p>
          <p className="text-foreground leading-relaxed mb-4">
            Featuring high-quality construction and advanced engineering, this product delivers consistent performance
            throughout your workday. The ergonomic design ensures comfortable use even during extended periods.
          </p>
          <p className="text-foreground leading-relaxed">
            Each component is crafted to Vikings Kenya&apos;s exacting standards for quality and durability, ensuring you get
            the best value for your investment.
          </p>
        </div>
      )}
      {selectedTab === "specifications" && (
        <div
          id="panel-specifications"
          role="tabpanel"
          aria-labelledby="tab-specifications"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {product.specifications ? (
            Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-4 bg-background rounded-lg">
                <span className="font-medium text-foreground">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-2">Specifications will be updated soon.</p>
          )}
        </div>
      )}
      {selectedTab === "reviews" && (
        <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-4xl font-bold text-foreground">{product.rating}</div>
                <div>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Based on {product.reviews} reviews</div>
                </div>
              </div>
            </div>
            <Button>Write a Review</Button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div key={review} className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">JD</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">John Doe</div>
                    <div className="flex items-center gap-2">
                      <ReviewSummary rating={5} totalReviews={0} />
                      <span className="text-sm text-muted-foreground">• 2 days ago</span>
                    </div>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">
                  Excellent product! Very reliable and the build quality is outstanding. Highly recommended for
                  professional use.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
))
ProductTabs.displayName = "ProductTabs"
