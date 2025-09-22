"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableActions from "./data-table-actions";
import CustomerDataTableCellViewer from "./customer-data-table-cell-viewer";
import { Order, statusConfig } from "@/types/orders";
import { format } from "date-fns";
import { OrderStatus as IOrderStatus } from "@/database/schema";
import OrderStatus from "./order-status";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="ID" />;
    },
    filterFn: (row, _, filterValue: string) => {
      const id = row.original.id.toString().toLowerCase();
      return id.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Customer" />;
    },
    cell: ({ row }) => <CustomerDataTableCellViewer item={row.original} />,
    filterFn: (row, _, filterValue: string) => {
      const name = row.original.customer.full_name.toLowerCase() ?? "";
      return name.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Amount" />;
    },
    cell: ({ row }) => (
      <p className="font-medium">
        KES {row.original.total_amount.toLocaleString()}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row: { original } }) => {
      return <OrderStatus order={original} />;
    },
    filterFn: (row, _, filterValue: string) => {
      const status = row.original.status.toLowerCase();
      const statusLabel =
        statusConfig[
          row.original.status as IOrderStatus
        ]?.label.toLowerCase() || "";
      return (
        status.includes(filterValue.toLowerCase()) ||
        statusLabel.includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <div className="text-sm">
          <p className="font-medium">{format(date, "MMM dd, yyyy")}</p>
          <p className="text-muted-foreground">{format(date, "h:mm aa")}</p>
        </div>
      );
    },
    filterFn: (row, _, filterValue: string) => {
      const date = new Date(row.original.created_at);
      const dateStr = format(date, "MMM dd, yyyy").toLowerCase();
      const timeStr = format(date, "h:mm aa").toLowerCase();
      return (
        dateStr.includes(filterValue.toLowerCase()) ||
        timeStr.includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at!);
      return (
        <div className="text-sm">
          <p className="font-medium">{format(date, "MMM dd, yyyy")}</p>
          <p className="text-muted-foreground">{format(date, "h:mm aa")}</p>
        </div>
      );
    },
    filterFn: (row, _, filterValue: string) => {
      const date = new Date(row.original.updated_at!);
      const dateStr = format(date, "MMM dd, yyyy").toLowerCase();
      const timeStr = format(date, "h:mm aa").toLowerCase();
      return (
        dateStr.includes(filterValue.toLowerCase()) ||
        timeStr.includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "total_ordered_items",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Total Ordered Items" />
      );
    },
    cell: ({ row }) => <p>{row.original.total_ordered_items}</p>,
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <DataTableActions order={original} />;
    },
  },
];
