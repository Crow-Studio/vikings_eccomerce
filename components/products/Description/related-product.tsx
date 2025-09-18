import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DBProduct } from "@/types/products";
import { generateSrcSet } from "@/lib/utils";
interface RelatedProductsSectionProps {
  relatedProducts: DBProduct[];
}
export const RelatedProductsSection = React.memo(
  ({ relatedProducts }: RelatedProductsSectionProps) => {
    if (relatedProducts.length === 0) return null;
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Related Products
          </h2>
          <Link href="/products">
            <Button variant="outline">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => {
            const image = relatedProduct.images[0];

            const srcSet = generateSrcSet({
              large: image.urls?.large as string,
              medium: image.urls?.medium as string,
              original: image.urls?.original as string,
              thumbnail: image.urls?.thumbnail as string,
            });

            return (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
              >
                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg">
                  <div className="aspect-square bg-blue-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative group-hover:bg-blue-100 transition-colors">
                    <img
                      src={image.urls?.medium as string}
                      srcSet={srcSet}
                      sizes="(max-width: 300px) 300px, (max-width: 600px) 600px,
         (max-width: 1200px) 1200px, 2000px"
                      alt={relatedProduct.name}
                      loading="lazy"
                      decoding="async"
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-lg font-bold text-blue-600">
                    KSh{" "}
                    {Number.parseFloat(relatedProduct.price).toLocaleString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
);
RelatedProductsSection.displayName = "RelatedProductsSection";
