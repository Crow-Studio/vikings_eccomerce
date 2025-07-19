import * as React from "react"
import { Shield, Truck, MapPin } from "lucide-react"

interface OrderSummaryProps {
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  subtotal: number
  shipping: number
  total: number
  isFreeShipping: boolean
}

export const OrderSummary = React.memo(({ items, subtotal, shipping, total, isFreeShipping }: OrderSummaryProps) => (
  <div className="bg-muted/30 rounded-xl p-6 sticky top-8">
    <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center text-sm">
          <div className="flex-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-muted-foreground">Qty: {item.quantity}</div>
          </div>
          <div className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</div>
        </div>
      ))}
      <div className="border-t border-muted pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className={isFreeShipping ? "text-green-600 font-medium" : ""}>
            {isFreeShipping ? "Free" : `KSh ${shipping.toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-muted">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
    {/* Trust Indicators */}
    <div className="mt-6 pt-6 border-t border-muted">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Secure payment</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Fast delivery</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Track your order</span>
        </div>
      </div>
    </div>
  </div>
))
OrderSummary.displayName = "OrderSummary"
