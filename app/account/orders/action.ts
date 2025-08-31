"use server"

import { db, eq, tables } from "@/database";
import { UserRole, OrderStatus } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { inArray } from "drizzle-orm";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function createOrderAction(data: {
    customerId: string
    status: OrderStatus
    items: { productId: string, price: string, quantity: number }[]
    totalAmount: string
}): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can create orders", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        const [newOrder] = await db.insert(tables.order).values({
            customer_id: data.customerId,
            status: data.status as OrderStatus,
            total_amount: data.totalAmount
        }).returning({ id: tables.order.id })

        if (data.items.length > 0) {
            await db.insert(tables.orderItem).values(
                data.items.map(i => ({
                    order_id: newOrder.id,
                    product_id: i.productId,
                    price: i.price,
                    quantity: i.quantity
                }))
            )
        }

        return { message: "Order created successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to create order", message: null }
    }
}

export async function updateOrderAction(data: {
    id: string
    status?: OrderStatus
    items?: { productId: string, price: string, quantity: number }[]
    totalAmount?: string
}): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can update orders", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        if (data.status || data.totalAmount) {
            await db.update(tables.order).set({
                ...(data.status ? { status: data.status as OrderStatus } : {}),
                ...(data.totalAmount ? { total_amount: data.totalAmount } : {})
            }).where(eq(tables.order.id, data.id))
        }

        if (data.items && data.items.length > 0) {
            await db.delete(tables.orderItem).where(eq(tables.orderItem.order_id, data.id))
            await db.insert(tables.orderItem).values(
                data.items.map(i => ({
                    order_id: data.id,
                    product_id: i.productId,
                    price: i.price,
                    quantity: i.quantity
                }))
            )
        }

        return { message: "Order updated successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to update order", message: null }
    }
}

export async function deleteOrdersAction(ids: string[]): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can delete orders", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)
        await db.delete(tables.orderItem).where(inArray(tables.orderItem.order_id, ids))
        await db.delete(tables.order).where(inArray(tables.order.id, ids))
        return { message: "Orders deleted successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to delete orders", message: null }
    }
}
