"use server"

import { db, eq, tables } from "@/database";
import { UserRole, OrderStatus } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

interface OrderItemInput {
    productId: string;
    variantId?: string;
    quantity: number;
}

export async function createOrderAction(data: {
    customerId: string
    status: OrderStatus
    items: OrderItemInput[]
}): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can create orders", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        const customerExists = await db
            .select({ id: tables.customer.id })
            .from(tables.customer)
            .where(eq(tables.customer.id, data.customerId))
            .limit(1)

        if (customerExists.length === 0) {
            return { errorMessage: "Customer not found", message: null }
        }

        const orderItemsWithPrices = await Promise.all(
            data.items.map(async (item) => {
                if (item.variantId) {
                    const variant = await db
                        .select({
                            id: tables.generatedVariants.id,
                            price: tables.generatedVariants.price,
                            inventory: tables.generatedVariants.inventory,
                            productId: tables.variants.product_id
                        })
                        .from(tables.generatedVariants)
                        .innerJoin(tables.variants, eq(tables.variants.id, tables.generatedVariants.variant_id))
                        .where(eq(tables.generatedVariants.id, item.variantId))
                        .limit(1)

                    if (variant.length === 0) {
                        throw new Error(`Variant ${item.variantId} not found`)
                    }

                    if (variant[0].inventory < item.quantity) {
                        throw new Error(`Insufficient inventory for variant ${item.variantId}`)
                    }

                    return {
                        product_id: variant[0].productId,
                        variant_id: item.variantId,
                        quantity: item.quantity,
                        price: variant[0].price
                    }
                } else {
                    const product = await db
                        .select({
                            id: tables.product.id,
                            price: tables.product.price,
                            visibility: tables.product.visibility
                        })
                        .from(tables.product)
                        .where(eq(tables.product.id, item.productId))
                        .limit(1)

                    if (product.length === 0) {
                        throw new Error(`Product ${item.productId} not found`)
                    }

                    if (product[0].visibility !== 'active') {
                        throw new Error(`Product ${item.productId} is not available`)
                    }

                    return {
                        product_id: item.productId,
                        variant_id: null,
                        quantity: item.quantity,
                        price: product[0].price
                    }
                }
            })
        )

        // Calculate total amount from actual prices
        const calculatedTotal = orderItemsWithPrices.reduce(
            (sum, item) => sum + (parseFloat(item.price) * item.quantity),
            0
        )

        // Create order with calculated total
        const [newOrder] = await db.insert(tables.order).values({
            customer_id: data.customerId,
            status: data.status,
            total_amount: calculatedTotal.toFixed(2)
        }).returning({ id: tables.order.id })

        if (orderItemsWithPrices.length > 0) {
            await db.insert(tables.orderItem).values(
                orderItemsWithPrices.map(item => ({
                    order_id: newOrder.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    price: item.price,
                    quantity: item.quantity
                }))
            )

            for (const item of orderItemsWithPrices) {
                if (item.variant_id) {
                    await db
                        .update(tables.generatedVariants)
                        .set({
                            inventory: sql`${tables.generatedVariants.inventory} - ${item.quantity}`
                        })
                        .where(eq(tables.generatedVariants.id, item.variant_id))
                }
            }
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
}): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can update orders", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        if (data.status) {
            const orderExists = await db
                .select({ id: tables.order.id })
                .from(tables.order)
                .where(eq(tables.order.id, data.id))
                .limit(1)

            if (orderExists.length === 0) {
                return { errorMessage: "Order not found", message: null }
            }

            await db
                .update(tables.order)
                .set({ status: data.status })
                .where(eq(tables.order.id, data.id))
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

        // Get order items to restore inventory before deletion
        const orderItemsToDelete = await db
            .select({
                variant_id: tables.orderItem.variant_id,
                quantity: tables.orderItem.quantity
            })
            .from(tables.orderItem)
            .where(inArray(tables.orderItem.order_id, ids))

        // Restore inventory for variants
        for (const item of orderItemsToDelete) {
            if (item.variant_id) {
                await db
                    .update(tables.generatedVariants)
                    .set({
                        inventory: sql`${tables.generatedVariants.inventory} + ${item.quantity}`
                    })
                    .where(eq(tables.generatedVariants.id, item.variant_id))
            }
        }

        await db.delete(tables.orderItem).where(inArray(tables.orderItem.order_id, ids))
        await db.delete(tables.order).where(inArray(tables.order.id, ids))

        return { message: "Orders deleted successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to delete orders", message: null }
    }
}