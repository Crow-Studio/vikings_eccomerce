"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableActions from "./data-table-actions";
import CustomerDataTableCellViewer from "./user-data-table-cell-viewer";
import { User } from "@/database/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Username" />;
    },
    cell: ({ row }) => <CustomerDataTableCellViewer item={row.original} />,
    filterFn: (row, _, filterValue: string) => {
      const name = row.original.username.toLowerCase() ?? "";
      return name.includes(filterValue.toLowerCase());
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
    accessorKey: "email_verified",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email Verified" />;
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.email_verified ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.email_verified ? "True" : "False"}
      </Badge>
    ),
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
    id: "actions",
    cell: ({ row: { original } }) => {
      return <DataTableActions user={original} />;
    },
  },
];
