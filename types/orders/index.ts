import * as z from "zod";
import { Customer, OrderStatus } from "@/database/schema";

export interface IProduct {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
}

export interface CreateOrderFormProps {
    customers: Customer[];
    products: IProduct[];
}

export const createOrderSchema = z.object({
    customerId: z.string().min(1, "Customer is required"),
    status: z.nativeEnum(OrderStatus),
    items: z
        .array(
            z.object({
                productId: z.string().min(1, "Product is required"),
                productName: z.string().min(1, "Product name is required"),
                price: z
                    .string()
                    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
                        message: "Price must be a valid positive number",
                    }),
                quantity: z.number().min(1, "Quantity must be at least 1"),
                imageUrl: z.string(),
            })
        )
        .min(1, "At least one product is required"),
    totalAmount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Total amount must be a valid number",
        }),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;