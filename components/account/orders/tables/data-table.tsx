"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTablePagination from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, User, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Order } from "@/types/orders";
import { deleteOrdersAction } from "@/app/account/orders/action";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isDeletingOrder, setIsDeletingOrder] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
  });

  const onDeleteOrder = async () => {
    const rows = table.getFilteredSelectedRowModel().rows;
    let ordersIds: string[] = [];

    if (rows.length > 0) {
      ordersIds = rows.map(({ original }) => {
        const order = original as Order;
        return order.id;
      });
    }
    toast.promise(
      (async () => {
        setIsDeletingOrder(true);
        const { message, errorMessage } = await deleteOrdersAction(ordersIds);
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting orders...",
        success: "Orders deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete orders",
        finally() {
          setIsDeletingOrder(false);
          router.refresh();
        },
        position: "top-center",
      }
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search customers, IDs, status..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="w-full max-w-sm"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                aria-label="Delete Orders"
                variant={"destructive"}
                className="h-8 flex-shrink-0"
                onClick={() => onDeleteOrder()}
                disabled={isDeletingOrder}
              >
                {isDeletingOrder ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span className="hidden sm:inline">Remove</span>
                <span className="ml-1">
                  ({table.getFilteredSelectedRowModel().rows.length})
                </span>
              </Button>
            )}
            <div className="hidden md:block">
              <DataTableViewOptions table={table} />
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const order = row.original as Order;
              return (
                <div 
                  key={row.id} 
                  className="rounded-lg border bg-card p-4 space-y-3"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {/* Header with selection and order info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Selection checkbox */}
                      {row.getVisibleCells().find((cell: any) => cell.column.id === 'select') && (
                        <div>
                          {flexRender(
                            row.getVisibleCells().find((cell: any) => cell.column.id === 'select')?.column.columnDef.cell,
                            row.getVisibleCells().find((cell: any) => cell.column.id === 'select')?.getContext()
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-sm text-foreground">
                          Order #{order.id?.slice(-8) || 'N/A'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {row.getVisibleCells().find((cell: any) => cell.column.id === 'actions') && (
                      <div className="flex items-center">
                        {flexRender(
                          row.getVisibleCells().find((cell: any) => cell.column.id === 'actions')?.column.columnDef.cell,
                          row.getVisibleCells().find((cell: any) => cell.column.id === 'actions')?.getContext()
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Order details */}
                  <div className="space-y-2">
                    {order.customer_name && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Customer</span>
                        </div>
                        <span className="text-xs text-foreground font-medium">{order.customer_name}</span>
                      </div>
                    )}
                    
                    {order.total_amount && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                        <span className="text-xs text-foreground font-semibold">
                          KES {typeof order.total_amount === 'number' ? order.total_amount.toLocaleString() : order.total_amount}
                        </span>
                      </div>
                    )}
                    
                    {order.status && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <span className="text-xs text-foreground">{order.status}</span>
                      </div>
                    )}
                    
                    {order.items_count && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Items</span>
                        <span className="text-xs text-foreground">{order.items_count} items</span>
                      </div>
                    )}
                    
                    {order.shipping_address && (
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground mr-2">Shipping</span>
                        <span className="text-xs text-foreground text-right flex-1">{order.shipping_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">No results found.</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-hidden rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <DataTablePagination table={table} />
    </div>
  );
}