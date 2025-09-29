"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableActions from "./data-table-actions";
import { CategoryWithProducts } from "@/lib/server/utils";
import { format } from "date-fns";

export const columns: ColumnDef<CategoryWithProducts>[] = [
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
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: "totalProducts",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Products" />;
    },
    cell: ({ row }) => {
      return <p>{row.original.totalProducts}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Create At" />;
    },
    cell: ({ row }) => {
      const createdAt = format(new Date(row.original.createdAt), "PPp");
      return <p>{createdAt}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <DataTableActions category={original} />;
    },
  },
];
