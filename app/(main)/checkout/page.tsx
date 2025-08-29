"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const whatsappNumber = "+254729016371"

  const handleWhatsAppOrder = () => {
    const message = "Hi! I'd like to place an order. Please send me your product catalog and pricing information."
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhoneCall = () => {
    window.open(`tel:${whatsappNumber}`, '_self')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Order via WhatsApp
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              For the fastest service and personalized assistance, place your order directly through WhatsApp
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Why order via WhatsApp?
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Instant communication with our sales team</li>
                <li>• Real-time product availability updates</li>
                <li>• Flexible payment options</li>
                <li>• Personalized product recommendations</li>
                <li>• Quick delivery arrangements</li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                size="lg"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Start WhatsApp Order
              </Button>

              <Button 
                onClick={handlePhoneCall}
                variant="outline"
                className="w-full py-6 text-lg"
                size="lg"
              >
                <Phone className="w-6 h-6 mr-3" />
                Call {whatsappNumber}
              </Button>
            </div>

            <div className="text-center pt-4">
              <Link href="/products">
                <Button variant="ghost" className="text-muted-foreground">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Business Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM | Saturday: 9:00 AM - 4:00 PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

