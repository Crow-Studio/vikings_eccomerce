import * as React from "react"
import { Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const ProductContactOptions = React.memo(() => (
  <div className="flex gap-4">
    <Button variant="outline" className="flex-1 bg-transparent">
      <Phone className="w-4 h-4" />
      Call Us
    </Button>
    <Button variant="outline" className="flex-1 bg-transparent">
      <MessageCircle className="w-4 h-4" />
      WhatsApp
    </Button>
  </div>
))
ProductContactOptions.displayName = "ProductContactOptions"
