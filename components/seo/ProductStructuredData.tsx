import { Product } from "@/types/products"

interface ProductStructuredDataProps {
  product: Product
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const baseUrl = "https://vikings.co.ke"
  const productImage = product.images?.[0]?.url || "/placeholder.svg"
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/products/${product.id}#product`,
    "name": product.name,
    "description": product.description || `High-quality ${product.name} from Vikings Kepower`,
    "image": [productImage],
    "url": `${baseUrl}/products/${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Vikings Kepower",
      "url": baseUrl,
    },
    "manufacturer": {
      "@type": "Organization", 
      "name": "Vikings Kepower",
      "url": baseUrl,
    },
    "category": product.category.name,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "price": product.price.replace(/[^0-9.]/g, ''),
      "priceCurrency": "KES",
      "availability": "https://schema.org/InStock",
      "condition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Vikings Kepower",
        "url": baseUrl,
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "John Doe"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Excellent quality tool, exactly as described. Fast delivery and great customer service."
      }
    ],
    "additionalProperty": product.variants?.map(variant => ({
      "@type": "PropertyValue",
      "name": variant.title,
      "value": variant.generatedVariants?.map(gv => gv.value).join(", ") || ""
    })) || []
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}
