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

  // Sales Over Time (last 30 days)
  const rawSalesOverTime = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${tables.order.created_at}), 'YYYY-MM-DD')`,
      total: sql<number>`SUM(${tables.order.total_amount})`,
    })
    .from(tables.order)
    .where(eq(tables.order.status, OrderStatus.DELIVERED))
    .groupBy(sql`date_trunc('day', ${tables.order.created_at})`)
    .orderBy(sql`date_trunc('day', ${tables.order.created_at})`)
    .limit(30)

  // Map into chart-friendly format
  const salesOverTime = rawSalesOverTime.map((row) => ({
    month: row.day, // keeping "month" to match your chart component
    desktop: Number(row.total),
  }))

  // Sales by Category
  const salesByCategory = await db
    .select({
      category: tables.category.name,
      revenue: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
    })
    .from(tables.orderItem)
    .innerJoin(tables.product, eq(tables.product.id, tables.orderItem.product_id))
    .innerJoin(tables.category, eq(tables.category.id, tables.product.category_id))
    .groupBy(tables.category.name)

  // Orders by Status
  const ordersByStatus = await db
    .select({
      status: tables.order.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(tables.order)
    .groupBy(tables.order.status)

  // Top Products by Revenue
  const topProducts = await db
    .select({
      product: tables.product.name,
      revenue: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
    })
    .from(tables.orderItem)
    .innerJoin(tables.product, eq(tables.product.id, tables.orderItem.product_id))
    .groupBy(tables.product.name)
    .orderBy(sql`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}) DESC`)
    .limit(10)

  return {
    totalProducts: Number(totalProducts),
    totalOrders: Number(totalOrders),
    totalCustomers: Number(totalCustomers),
    totalRevenue: Number(totalRevenue),
    salesOverTime, // ✅ Now matches your chart props
    salesByCategory,
    ordersByStatus,
    topProducts,
  }
}
