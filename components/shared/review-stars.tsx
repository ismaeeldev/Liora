import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewStarsProps {
  rating: number // 0-5
  maxRating?: number
  className?: string
  starClassName?: string
  showText?: boolean
  reviewCount?: number
}

export function ReviewStars({
  rating,
  maxRating = 5,
  className,
  starClassName,
  showText = false,
  reviewCount,
}: ReviewStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn("h-4 w-4 fill-warning text-warning", starClassName)}
          />
        ))}
        {hasHalfStar && (
          <div className="relative h-4 w-4">
            <Star className={cn("absolute inset-0 h-4 w-4 text-warning", starClassName)} />
            <StarHalf className={cn("absolute inset-0 h-4 w-4 fill-warning text-warning", starClassName)} />
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn("h-4 w-4 text-warning", starClassName)}
          />
        ))}
      </div>
      {showText && (
        <span className="text-sm font-medium text-slate-700">
          {rating.toFixed(1)} {reviewCount !== undefined && <span className="text-slate-500 font-normal">({reviewCount})</span>}
        </span>
      )}
    </div>
  )
}
