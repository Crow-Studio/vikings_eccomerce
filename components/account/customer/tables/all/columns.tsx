"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import DataTableActions from "./data-table-actions";
import { Customer } from "@/types/customers";
import CustomerDataTableCellViewer from "./customer-data-table-cell-viewer";

export const columns: ColumnDef<Customer>[] = [
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
    cell: ({ row }) => <CustomerDataTableCellViewer item={row.original} />,
    filterFn: (row, _, filterValue: string) => {
      const name = row.original.full_name.toLowerCase() ?? "";
      return name.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "total_orders",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Orders" />;
    },
    cell: ({ row }) => <p>{row.original.total_orders}</p>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="City" />;
    },
    cell: ({ row }) => <p>{row.original.city}</p>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Address" />;
    },
    cell: ({ row }) => <p>{row.original.address}</p>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Phone" />;
    },
    cell: ({ row }) => <p>{row.original.phone}</p>,
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return <DataTableActions customer={original} />;
    },
  },
];
