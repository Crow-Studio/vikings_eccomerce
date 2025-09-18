import { notFound } from "next/navigation"
import { ProductDetailsClient } from "@/components/products/Description/product"
import { getProductById, getMoreProducts } from "@/actions/product-actions"
interface PageProps {
  params: Promise<{
    id: string
  }>
}
export async function generateStaticParams() {
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
  
  // Fetch more products to display below the current product
  const moreProducts = await getMoreProducts(id, 8)
  
  return <ProductDetailsClient product={product} moreProducts={moreProducts} />
}