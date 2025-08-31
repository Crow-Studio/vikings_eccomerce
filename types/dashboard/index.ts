import { OrderStatus } from "@/database/schema";

export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    thisMonthData: {
        date: string;
        revenue: number;
    }[];
    lastMonthData: {
        date: string;
        revenue: number;
    }[];
    salesByCategory: {
        category: string;
        revenue: number;
        orderCount: number;
    }[];
    ordersByStatus: {
        status: OrderStatus;
        count: number;
        totalValue: number;
    }[];
    topProducts: {
        productId: string;
        productName: string;
        revenue: number;
        unitsSold: number;
        orderCount: number;
    }[];
    recentOrders: {
        orderId: string;
        customerName: string;
        status: OrderStatus;
        totalAmount: number;
        createdAt: Date;
    }[];
}