import ProductDescPage from "@/components/products/Description/product"
import { mockProducts } from "@/data/products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = mockProducts.find(p => p.id.toString() === resolvedParams.id)
  
  if (!product) {
    notFound()
  }
  
  return <ProductDescPage {...product} params={{ id: resolvedParams.id }} />
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id.toString(),
  }))
}