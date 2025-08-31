"use client"
import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
interface ImageGalleryProps {
  images?: string[]
  currentIndex: number
  onImageChange: (index: number) => void
}
export const ImageGallery = React.memo(({ images = [], currentIndex, onImageChange }: ImageGalleryProps) => {
  const imageArray = images.length > 0 ? images : ["/placeholder.svg?height=600&width=600"] 
  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-square bg-muted/30 rounded-xl overflow-hidden group">
        {}
        <Image
          src={imageArray[currentIndex] || "/placeholder.svg"}
          alt="Product Image"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {imageArray.length > 1 && (
          <>
            <button
              onClick={() => onImageChange(currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onImageChange(currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
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
              className={cn(
                "relative aspect-square bg-muted/30 rounded-lg overflow-hidden transition-all duration-200",
                index === currentIndex ? "ring-2 ring-primary" : "hover:bg-muted/50",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
ImageGallery.displayName = "ImageGallery"
