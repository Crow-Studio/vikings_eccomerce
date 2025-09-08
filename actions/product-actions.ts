"use server"
import { db } from "@/database"
import { and, ne, eq, desc } from "drizzle-orm"
import { Visibility } from "@/database/schema"
import type { Product, DBProduct } from "@/types/products"
import { transformDBProductToProduct } from "@/types/products"
export async function getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
  try {
    const dbRelatedProducts = await db.query.product.findMany({
      where: (table) => and(
        eq(table.category_id, categoryId),
        ne(table.id, productId),
        eq(table.visibility, Visibility.ACTIVE)
      ),
      with: {
        category: true,
        images: true,
        variants: {
          with: {
            generatedVariants: true,
          },
        },
      },
      limit: 4,
    }) as DBProduct[]
    return dbRelatedProducts.map(transformDBProductToProduct)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const dbProduct = await db.query.product.findFirst({
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
    }) as DBProduct | undefined
    if (!dbProduct) {
      return null
    }
    return transformDBProductToProduct(dbProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getMoreProducts(excludeProductId: string, limit: number = 8): Promise<Product[]> {
  try {
    const dbProducts = await db.query.product.findMany({
      where: (table) => and(
        ne(table.id, excludeProductId),
        eq(table.visibility, Visibility.ACTIVE)
      ),
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
      limit,
    }) as DBProduct[]
    
    return dbProducts.map(transformDBProductToProduct)
  } catch (error) {
    console.error('Error fetching more products:', error)
    return []
  }
}