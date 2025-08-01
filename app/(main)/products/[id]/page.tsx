import { notFound } from "next/navigation"
import { ProductDetailsClient } from "@/components/products/Description/product"
import { getProductById } from "@/actions/product-actions"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  // You can move this to a server action too if needed
  const { db } = await import("@/database")
  const products = await db.query.product.findMany({
    columns: { id: true },
  })
  return products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    return notFound()
  }

  return <ProductDetailsClient product={product} />
}