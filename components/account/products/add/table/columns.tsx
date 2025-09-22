"use client";
import { DBProduct } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Visibility } from "@/database/schema";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import ProductDataTableCellViewer from "./product-data-table-cell-viewer";
import DataTableActions from "./data-table-actions";
export const columns: ColumnDef<DBProduct>[] = [
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
    cell: ({ row }) => <ProductDataTableCellViewer item={row.original} />,
    filterFn: (row, _, filterValue: string) => {
      const name = row.original.name.toLowerCase() ?? "";
      return name.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => (
      <p>
        {row.original.category ? row.original.category.name : "Uncategorized"}
      </p>
    ),
  },
  {
    accessorKey: "visibility",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.visibility === Visibility.ACTIVE ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.visibility}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KES",
      }).format(amount);
      return <p>{formatted}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <DataTableActions product={original} />;
    },
  },
];
