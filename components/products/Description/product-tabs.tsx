"use client"
import * as React from "react"
import { TabButton } from "@/components/products/Description/tab-button"
import type { Product } from "@/types/products"
interface ProductTabsProps {
  product: Product
  selectedTab: string
  onTabChange: (tabId: string) => void
}
export const ProductTabs = React.memo(({ product, selectedTab, onTabChange }: ProductTabsProps) => (
  <div className="mb-12">
    <div className="border-b border-blue-100 mb-6">
      <nav className="flex space-x-8" role="tablist">
        <TabButton
          id="description"
          label="Description"
          isActive={selectedTab === "description"}
          onClick={onTabChange}
        />
      </nav>
    </div>
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100 shadow-lg">
      {selectedTab === "description" && (
        <div id="panel-description" role="tabpanel" aria-labelledby="tab-description" className="prose max-w-none">
          <p className="text-foreground leading-relaxed mb-4">{product.description}</p>
        </div>
      )}
    </div>
  </div>
))
ProductTabs.displayName = "ProductTabs"
