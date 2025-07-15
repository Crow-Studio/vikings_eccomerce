"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images?: string[]
  currentIndex: number
  onImageChange: (index: number) => void
}

export const ImageGallery = React.memo(({ images = [], currentIndex, onImageChange }: ImageGalleryProps) => {
  const imageArray = images.length > 0 ? images : ["/placeholder.svg?height=200&width=200"] // Fallback placeholder

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-muted/30 rounded-xl overflow-hidden group">
        {/* Main Image Display */}
        <div className="w-full h-full flex items-center justify-center">
          {/* Using a placeholder div for image, replace with <img src={imageArray[currentIndex] || "/placeholder.svg"} alt="Product Image" /> */}
          <div className="w-3/4 h-3/4 bg-primary/20 rounded-lg flex items-center justify-center">
            <div className="text-6xl font-bold text-primary/40">{currentIndex + 1}</div>
          </div>
        </div>
        {imageArray.length > 1 && (
          <>
            <button
              onClick={() => onImageChange(currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onImageChange(currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {imageArray.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageArray.map((imageSrc, index) => (
            <button
              key={index}
              onClick={() => onImageChange(index)}
              className={`aspect-square bg-muted/30 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex ? "ring-2 ring-primary" : "hover:bg-muted/50"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              {/* Using a placeholder div for thumbnail, replace with <img src={imageSrc || "/placeholder.svg"} alt={`Product thumbnail ${index + 1}`} className="w-full h-full object-cover" /> */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-primary/20 rounded"></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
ImageGallery.displayName = "ImageGallery"
