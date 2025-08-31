"use client";

import { IProduct, Order } from "@/types/orders";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Customer } from "@/database/schema";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";

interface OrdersDataTableProps {
  orders: Order[];
  customers: Customer[];
  products: IProduct[];
}

export default function OrdersDataTable({
  orders,
  customers,
  products,
}: OrdersDataTableProps) {
  const { type, isOpen, onPopulateData, data } = useModal();

  const isModalOpen = type === "editOrder" && isOpen;

  useEffect(() => {
    if (isModalOpen) {
      onPopulateData({
        ...data,
        customers,
        products,
      });
    }
  }, [isModalOpen, customers, products, onPopulateData]);

  return <DataTable columns={columns} data={orders} />;
}
