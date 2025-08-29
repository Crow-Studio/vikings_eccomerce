"use client";

import { ShoppingBasket } from "@/components/svgs/ShoppingBasket";
import { OrderStatus } from "@/database/schema";
import { ShoppingBasketIcon, Users, Wallet } from "lucide-react";
import { useState } from "react";

interface Props {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    salesOverTime: {
      month: string;
      desktop: number;
    }[];
    salesByCategory: {
      category: string;
      revenue: number;
    }[];
    ordersByStatus: {
      status: OrderStatus;
      count: number;
    }[];
    topProducts: {
      product: string;
      revenue: number;
    }[];
  };
}

export default function DashboardStats({ stats: dbStats }: Props) {
  const [stats] = useState([
    {
      title: "Total Products",
      icon: <ShoppingBasket className="size-7 md:size-8 xl:size-12" />,
      value: dbStats.totalProducts,
      label: "active",
    },
    {
      title: "Total Orders",
      icon: <ShoppingBasketIcon className="size-7 md:size-8 xl:size-12" />,
      value: dbStats.totalOrders,
      label: "fulfilled ",
    },
    {
      title: "Total Customers",
      icon: <Users className="size-7 md:size-8 xl:size-12" />,
      value: dbStats.totalCustomers,
      label: "registered",
    },
    {
      title: "Total Sales",
      icon: <Wallet className="size-7 md:size-8 xl:size-12" />,
      value: dbStats.totalRevenue.toLocaleString(),
      label: "revenue",
    },
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="space-y-2 p-5 border shadow rounded-xl bg-card"
        >
          <h2 className="uppercase text-muted-foreground text-sm">
            {stat.title}
          </h2>
          <div className="flex items-center gap-x-3">
            {stat.icon}
            <p className="text-3xl xl:text-5xl">
              {stat.value}
              <span className="text-xs xl:text-base text-muted-foreground uppercase">
                / {stat.label}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
