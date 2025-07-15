import * as React from "react"
import { Shield, Truck, RefreshCw } from "lucide-react"

export const ProductTrustBadges = React.memo(() => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
      <Shield className="w-6 h-6 text-primary" />
      <div>
        <div className="text-sm font-medium">2 Year Warranty</div>
        <div className="text-xs text-muted-foreground">Full coverage</div>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
      <Truck className="w-6 h-6 text-primary" />
      <div>
        <div className="text-sm font-medium">Free Shipping</div>
        <div className="text-xs text-muted-foreground">Within Nairobi</div>
      </div>
    </div>
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
      <RefreshCw className="w-6 h-6 text-primary" />
      <div>
        <div className="text-sm font-medium">30-Day Returns</div>
        <div className="text-xs text-muted-foreground">No questions asked</div>
      </div>
    </div>
  </div>
))
ProductTrustBadges.displayName = "ProductTrustBadges"
