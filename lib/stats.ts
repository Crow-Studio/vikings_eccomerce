import { db, tables } from "@/database"
import { OrderStatus, Visibility } from "@/database/schema"
import { sql, eq } from "drizzle-orm"

export async function getDashboardStats() {
  // Total Active Products
  const [{ count: totalProducts }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.product)
    .where(eq(tables.product.visibility, Visibility.ACTIVE))

  // Total Fulfilled Orders
  const [{ count: totalOrders }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.order)
    .where(eq(tables.order.status, OrderStatus.DELIVERED))

  // Total Registered Customers
  const [{ count: totalCustomers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.customer)

  // Total Sales Revenue
  const [{ total: totalRevenue }] = await db
    .select({ total: sql<string>`COALESCE(SUM(${tables.order.total_amount}), '0')` })
    .from(tables.order)
    .where(eq(tables.order.status, OrderStatus.DELIVERED))

  return {
    totalProducts: Number(totalProducts),
    totalOrders: Number(totalOrders),
    totalCustomers: Number(totalCustomers),
    totalRevenue: Number(totalRevenue),
  }
}
