import * as React from "react"
import { Star } from "lucide-react"

interface ReviewSummaryProps {
  rating: number
  totalReviews: number
}

export const ReviewSummary = React.memo(({ rating, totalReviews }: ReviewSummaryProps) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          aria-hidden="true"
        />
      ))}
    </div>
    <span className="text-sm font-medium">{rating}</span>
    <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
  </div>
))
ReviewSummary.displayName = "ReviewSummary"
