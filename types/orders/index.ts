import * as z from "zod";
import { Customer, OrderStatus } from "@/database/schema";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

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

export interface OrderItems {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    price: string;
    product_id: string;
    order_id: string;
    quantity: number;
}

export interface Order {
    customer: {
        address: string | null;
        id: string;
        email: string;
        full_name: string;
        phone: string | null;
        avatar: string | null;
        city: string | null;
        country: string | null;
        created_at: Date;
        updated_at: Date | null;
    };
    id: string;
    status: OrderStatus;
    total_amount: string;
    total_ordered_items: number;
    created_at: string;
    updated_at: string | null;
    items: OrderItems[]
}

export const statusConfig = {
    [OrderStatus.PENDING]: {
        label: "Pending",
        variant: "secondary" as const,
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    [OrderStatus.PROCESSING]: {
        label: "Processing",
        variant: "default" as const,
        icon: Package,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    [OrderStatus.SHIPPED]: {
        label: "Shipped",
        variant: "default" as const,
        icon: Truck,
        className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    },
    [OrderStatus.DELIVERED]: {
        label: "Delivered",
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [OrderStatus.CANCELLED]: {
        label: "Cancelled",
        variant: "destructive" as const,
        icon: XCircle,
        className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
};