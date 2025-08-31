import { db, tables } from "@/database"
import { OrderStatus, Visibility } from "@/database/schema"
import { sql, eq, and, gte, lt } from "drizzle-orm"

export async function getDashboardStats() {
  const [{ count: totalProducts }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.product)
    .where(eq(tables.product.visibility, Visibility.ACTIVE))

  const [{ count: totalOrders }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.order)
    .where(eq(tables.order.status, OrderStatus.DELIVERED))

  const [{ count: totalCustomers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(tables.customer)

  const [{ total: totalRevenue }] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}), '0')`
    })
    .from(tables.orderItem)
    .innerJoin(tables.order, eq(tables.order.id, tables.orderItem.order_id))
    .where(eq(tables.order.status, OrderStatus.DELIVERED))

  // Get sales data for this month with timezone handling
  const thisMonthSales = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD')`,
      total: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
    })
    .from(tables.orderItem)
    .innerJoin(tables.order, eq(tables.order.id, tables.orderItem.order_id))
    .where(and(
      eq(tables.order.status, OrderStatus.DELIVERED),
      gte(tables.order.created_at, sql`date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi')::timestamptz`),
      lt(tables.order.created_at, sql`(date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi') + INTERVAL '1 month')::timestamptz`)
    ))
    .groupBy(sql`date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi')`)
    .orderBy(sql`date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi')`)

  // Get sales data for last month with timezone handling
  const lastMonthSales = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi'), 'YYYY-MM-DD')`,
      total: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
    })
    .from(tables.orderItem)
    .innerJoin(tables.order, eq(tables.order.id, tables.orderItem.order_id))
    .where(and(
      eq(tables.order.status, OrderStatus.DELIVERED),
      gte(tables.order.created_at, sql`(date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi') - INTERVAL '1 month')::timestamptz`),
      lt(tables.order.created_at, sql`date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'Africa/Nairobi')::timestamptz`)
    ))
    .groupBy(sql`date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi')`)
    .orderBy(sql`date_trunc('day', ${tables.order.created_at} AT TIME ZONE 'Africa/Nairobi')`)

  // Generate complete date ranges with proper timezone handling
  const generateThisMonthRange = () => {
    const dates = [];
    // Get current date in Kenya timezone
    const now = new Date();
    const kenyaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }));
    const year = kenyaTime.getFullYear();
    const month = kenyaTime.getMonth();
    const currentDay = kenyaTime.getDate();

    // Generate all days from 1st to current day (including today)
    for (let day = 1; day <= currentDay; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateLastMonthRange = () => {
    const dates = [];
    // Get current date in Kenya timezone
    const now = new Date();
    const kenyaTime = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }));
    const year = kenyaTime.getFullYear();
    const month = kenyaTime.getMonth();

    // Get last month's details
    const lastMonthDate = new Date(year, month - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    // Get the last day of last month (how many days it has)
    const daysInLastMonth = new Date(year, month, 0).getDate();

    // Generate all days of last month
    for (let day = 1; day <= daysInLastMonth; day++) {
      const date = new Date(lastMonthYear, lastMonth, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const thisMonthRange = generateThisMonthRange();
  const lastMonthRange = generateLastMonthRange();

  const thisMonthData = thisMonthRange.map((dateStr) => {
    const salesDataForDate = thisMonthSales.find((item) => item.day === dateStr);
    return {
      date: dateStr,
      revenue: salesDataForDate ? Number(salesDataForDate.total) : 0,
    };
  });

  const lastMonthData = lastMonthRange.map((dateStr) => {
    const salesDataForDate = lastMonthSales.find((item) => item.day === dateStr);
    return {
      date: dateStr,
      revenue: salesDataForDate ? Number(salesDataForDate.total) : 0,
    };
  });

  const salesByCategory = await db
    .select({
      category: tables.category.name,
      revenue: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
      orderCount: sql<number>`COUNT(DISTINCT ${tables.order.id})`
    })
    .from(tables.orderItem)
    .innerJoin(tables.order, eq(tables.order.id, tables.orderItem.order_id))
    .innerJoin(tables.product, eq(tables.product.id, tables.orderItem.product_id))
    .innerJoin(tables.category, eq(tables.category.id, tables.product.category_id))
    .where(eq(tables.order.status, OrderStatus.DELIVERED))
    .groupBy(tables.category.name)
    .orderBy(sql`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}) DESC`)

  const ordersByStatus = await db
    .select({
      status: tables.order.status,
      count: sql<number>`COUNT(*)`,
      totalValue: sql<number>`COALESCE(SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}), 0)`
    })
    .from(tables.order)
    .leftJoin(tables.orderItem, eq(tables.orderItem.order_id, tables.order.id))
    .groupBy(tables.order.status)

  const topProducts = await db
    .select({
      productId: tables.product.id,
      productName: tables.product.name,
      revenue: sql<number>`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity})`,
      unitsSold: sql<number>`SUM(${tables.orderItem.quantity})`,
      orderCount: sql<number>`COUNT(DISTINCT ${tables.order.id})`
    })
    .from(tables.orderItem)
    .innerJoin(tables.order, eq(tables.order.id, tables.orderItem.order_id))
    .innerJoin(tables.product, eq(tables.product.id, tables.orderItem.product_id))
    .where(eq(tables.order.status, OrderStatus.DELIVERED))
    .groupBy(tables.product.id, tables.product.name)
    .orderBy(sql`SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}) DESC`)
    .limit(10)

  const recentOrders = await db
    .select({
      orderId: tables.order.id,
      customerName: tables.customer.full_name,
      status: tables.order.status,
      totalAmount: sql<number>`COALESCE(SUM(${tables.orderItem.price} * ${tables.orderItem.quantity}), 0)`,
      createdAt: tables.order.created_at
    })
    .from(tables.order)
    .innerJoin(tables.customer, eq(tables.customer.id, tables.order.customer_id))
    .leftJoin(tables.orderItem, eq(tables.orderItem.order_id, tables.order.id))
    .groupBy(
      tables.order.id,
      tables.customer.full_name,
      tables.order.status,
      tables.order.created_at
    )
    .orderBy(sql`${tables.order.created_at} DESC`)
    .limit(5)

  return {
    totalProducts: Number(totalProducts),
    totalOrders: Number(totalOrders),
    totalCustomers: Number(totalCustomers),
    totalRevenue: Number(totalRevenue),
    thisMonthData,
    lastMonthData,
    salesByCategory,
    ordersByStatus,
    topProducts,
    recentOrders
  }
}