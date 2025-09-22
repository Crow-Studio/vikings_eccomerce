"use client"
import React, { memo } from "react"
import Image from "next/image"
import { X, Heart, ShoppingCart } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { IconButton } from "@/components/home/header/icon-button"
import WishListIcon from "@/components/svgs/Wishlist"
import { useCartStore } from "@/store/cart-store" 
import { toast } from "sonner" 
import type { WishlistItem } from "@/types/header"
interface WishlistSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  items?: WishlistItem[]
  itemCount: number
  onRemoveItem: (id: string) => void
}
interface WishlistItemComponentProps {
  item: WishlistItem
  onRemove: (id: string) => void
  onAddToCart: (item: WishlistItem) => void
}
const WishlistItemComponent = memo(({ item, onRemove, onAddToCart }: WishlistItemComponentProps) => (
  <div className="flex items-center space-x-4 py-4">
    <div className="relative w-16 h-16 flex-shrink-0">
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover rounded-md"
        sizes="64px"
      />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-sm truncate">{item.name}</h3>
      <p className="text-sm text-muted-foreground">
        KSh {item.price.toLocaleString()}
      </p>
      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          {Object.entries(item.selectedVariants).map(([key, value]) => (
            <span key={key} className="mr-2">
              {key}: {value}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2"
        onClick={() => onAddToCart(item)}
      >
        <ShoppingCart className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={() => onRemove(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  </div>
))
WishlistItemComponent.displayName = "WishlistItemComponent"
export const WishlistSheet = memo(
  ({ isOpen, onOpenChange, items = [], itemCount, onRemoveItem }: WishlistSheetProps) => {
    const { addItem } = useCartStore() 
    const safeItems = items || []
    const handleAddToCart = (wishlistItem: WishlistItem) => {
      addItem({
        id: wishlistItem.id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity: 1, 
        image: wishlistItem.image,
        selectedVariants: wishlistItem.selectedVariants,
      })
      onRemoveItem(wishlistItem.id)
      toast.success(`${wishlistItem.name} added to cart`, {
        description: `Moved from wishlist to cart successfully`,
        action: {
          label: "View Cart",
          onClick: () => {
            console.log("View cart clicked")
          },
        },
      })
    }
    const handleAddAllToCart = () => {
      const itemCount = safeItems.length
      safeItems.forEach((item) => {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
          selectedVariants: item.selectedVariants,
        })
      })
      safeItems.forEach((item) => {
        onRemoveItem(item.id)
      })
      toast.success(`All items added to cart`, {
        description: `${itemCount} ${itemCount === 1 ? 'item' : 'items'} moved from wishlist to cart`,
        action: {
          label: "View Cart",
          onClick: () => {
            console.log("View cart clicked")
          },
        },
      })
    }
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <div>
            <IconButton
              icon={WishListIcon}
              tooltip="Wishlist"
              badge={itemCount > 0 ? itemCount.toString() : undefined}
            />
          </div>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Wishlist ({itemCount})</span>
            </SheetTitle>
          </SheetHeader>
          {safeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">
                Save items you love for later
              </p>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-0">
                {safeItems.map((item, index) => (
                  <div key={item.id}>
                    <WishlistItemComponent 
                      item={item} 
                      onRemove={onRemoveItem}
                      onAddToCart={handleAddToCart}
                    />
                    {index < safeItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {safeItems.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <Button 
                className="w-full" 
                onClick={handleAddAllToCart}
              >
                Add All to Cart ({safeItems.length} items)
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    )
  },
)
WishlistSheet.displayName = "WishlistSheet"