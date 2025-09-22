"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Package, Truck } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import GrainOverlay from "@/components/global/GrainOverlay"
export default function OrderSuccessPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const orderNumber = `VKG-${Math.floor(100000 + Math.random() * 900000)}`
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 500
  const total = subtotal + shipping
  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
    return () => {
      clearCart()
    }
  }, [items.length, router, clearCart])
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8  relative">
      <GrainOverlay />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
        <div className="bg-muted/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-muted">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-semibold text-foreground">{orderNumber}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-muted-foreground mb-1">Order Date</p>
              <p className="font-semibold text-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="font-semibold text-foreground">KSh {total.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-background rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/20 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>KSh {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-muted">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">What&apos;s Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Order Processing</h3>
                <p className="text-sm text-muted-foreground">
                  We&apos;re preparing your items for shipment. You&apos;ll receive an email when your order ships.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Estimated delivery within 3-5 business days. You can track your order using the order number.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <button className="px-6 py-3 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-full sm:w-auto">
              Continue Shopping
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
