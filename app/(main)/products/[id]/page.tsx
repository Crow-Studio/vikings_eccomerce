import { db, eq } from "@/database"
import { desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { ProductDetailsClient } from "@/components/products/Description/product"
import type { DBProduct } from "@/types"
import { unstable_cache } from "next/cache"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const products = await db.query.product.findMany({
    columns: { id: true },
  })
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  
  const getCachedProduct = unstable_cache(
    async () => {
      return await db.query.product.findFirst({
        where: (table) => eq(table.id, id),
        with: {
          category: true,
          images: true,
          variants: {
            with: {
              generatedVariants: true,
            },
          },
        },
        orderBy: (table) => desc(table.created_at),
      })
    },
    [id],
    {
      tags: ['product', `product-${id}`],
      revalidate: 3600,
    }
  )
  
  const product: DBProduct | undefined = await getCachedProduct()

  if (!product) {
    return notFound()
  }

  return <ProductDetailsClient product={product} />
}