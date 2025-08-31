import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import SolarCartLarge2Outline from "@/components/svgs/SolarCartLarge2Outline"
import { CartItem } from "./cart-item"
import { EmptyCart } from "./empty-cart"
interface CartSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  items: any[]
  itemCount: number
  cartTotal: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}
export const CartSheet = memo(
  ({ isOpen, onOpenChange, items, itemCount, cartTotal, onUpdateQuantity, onRemoveItem }: CartSheetProps) => (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full cursor-pointer relative h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200 hover:scale-105"
        >
          <SolarCartLarge2Outline className="h-4 w-4 sm:h-5 sm:w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] animate-pulse">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-5">
          <SheetTitle>Your Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="space-y-4 mb-6 max-h-[60vh] overflow-auto pr-2">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />
              ))}
            </div>
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link href="/checkout">
                    <Button className="w-full">Checkout</Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/products">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  ),
)
CartSheet.displayName = "CartSheet"
