import CreateOrderButton from "@/components/account/orders/create-order-button";
import OrdersDataTable from "@/components/account/orders/tables/Orders";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrdersPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/admin/signin");
  }

  if (!user.email_verified) {
    return redirect("/auth/verify-email");
  }

  const customers = await db.query.customer.findMany({
    orderBy: (table) => desc(table.updated_at),
  });

  const ordersData = await db.query.order.findMany({
    with: {
      customer: true,
      items: true,
    },
    orderBy: (table) => desc(table.updated_at),
  });

  const orders = ordersData.map((order) => ({
    customer: order.customer,
    id: order.id,
    status: order.status,
    total_amount: order.total_amount,
    total_ordered_items: order.items.length,
    items: order.items,
    created_at: order.created_at.toISOString(),
    updated_at: order.updated_at?.toISOString() || null,
  }));

  console.log("orders", orders);

  const products = await db.query.product.findMany({
    with: {
      images: true,
    },
    orderBy: (table) => desc(table.updated_at),
  });

  const productData = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price.toString(),
    imageUrl: p.images[0]?.url ?? "",
  }));

  return (
    <div className="grid gap-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Orders</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all your Viking store orders
          </p>
        </div>
        <CreateOrderButton customers={customers} products={productData} />
      </div>
      <OrdersDataTable orders={orders} />
    </div>
  );
}
