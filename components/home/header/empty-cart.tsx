import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import SolarCartLarge2Outline from "@/components/svgs/SolarCartLarge2Outline"
export const EmptyCart = memo(() => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <SolarCartLarge2Outline className="h-16 w-16 text-muted-foreground mb-4" />
    <p className="text-muted-foreground mb-6">Your cart is empty</p>
    <SheetClose asChild>
      <Link href="/products">
        <Button>Continue Shopping</Button>
      </Link>
    </SheetClose>
  </div>
))
EmptyCart.displayName = "EmptyCart"
