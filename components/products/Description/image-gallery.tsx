"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, generateSrcSet } from "@/lib/utils";
import { ProductImage } from "@/database/schema";

interface ImageGalleryProps {
  images: ProductImage[];
  currentIndex: number;
  onImageChange: (index: number) => void;
}

export const ImageGallery = React.memo(
  ({ images = [], currentIndex, onImageChange }: ImageGalleryProps) => {
    const imageArray = images.length > 0 ? images : [];

    const getSrcSet = (img: ProductImage) =>
      generateSrcSet({
        large: img.urls?.large as string,
        medium: img.urls?.medium as string,
        original: img.urls?.original as string,
        thumbnail: img.urls?.thumbnail as string,
      });

    return (
      <div className="space-y-4">
        <div className="relative w-full aspect-square bg-white border border-blue-100 rounded-2xl overflow-hidden group shadow-lg">
          {imageArray.length > 0 ? (
            <img
              src={imageArray[currentIndex].urls?.medium as string}
              srcSet={getSrcSet(imageArray[currentIndex])}
              sizes="(max-width: 300px) 300px, (max-width: 600px) 600px,
                     (max-width: 1200px) 1200px, 2000px"
              alt={imageArray[currentIndex].alt_text ?? "Product Image"}
              loading="lazy"
              decoding="async"
              className="object-contain w-full h-full"
            />
          ) : (
            <img
              src="/placeholder.svg"
              alt="Placeholder"
              className="object-contain w-full h-full"
            />
          )}

          {imageArray.length > 1 && (
            <>
              <button
                onClick={() =>
                  onImageChange(
                    currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white border border-blue-100 shadow-md z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() =>
                  onImageChange(
                    currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white border border-blue-100 shadow-md z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-blue-600" />
              </button>
            </>
          )}
        </div>

        {imageArray.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {imageArray.map((img, index) => (
              <button
                key={img.id}
                onClick={() => onImageChange(index)}
                className={cn(
                  "relative aspect-square bg-white border border-blue-100 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-200 shadow-sm",
                  index === currentIndex
                    ? "ring-2 ring-blue-600 border-blue-600"
                    : ""
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img.urls?.thumbnail || img.urls?.medium || img.url}
                  srcSet={getSrcSet(img)}
                  sizes="(max-width: 768px) 25vw, (max-width: 1200px) 10vw, 5vw"
                  alt={img.alt_text ?? `Product thumbnail ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImageGallery.displayName = "ImageGallery";
