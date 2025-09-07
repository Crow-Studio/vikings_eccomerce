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
import { Loader2, Trash2, Menu, X } from "lucide-react";
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
  const [showMobileActions, setShowMobileActions] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileActions(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          setShowMobileActions(false);
        },
        position: "top-center",
      }
    );
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {/* Mobile-first responsive header */}
        <div className="space-y-3">
          {/* Search bar - always visible */}
          <div className="w-full">
            <Input
              placeholder="Search customers, IDs, status..."
              value={table.getState().globalFilter ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="w-full text-base md:text-sm"
            />
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex md:items-center md:justify-end md:gap-x-3">
            {selectedCount > 0 && (
              <Button
                aria-label="Delete Orders"
                variant={"destructive"}
                className="h-8"
                onClick={() => onDeleteOrder()}
                disabled={isDeletingOrder}
              >
                {isDeletingOrder ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Remove ({selectedCount})
              </Button>
            )}
            <DataTableViewOptions table={table} />
          </div>

          {/* Mobile actions toggle */}
          <div className="flex items-center justify-between md:hidden">
            <div className="text-sm text-muted-foreground">
              {selectedCount > 0 && `${selectedCount} selected`}
              {data.length > 0 && ` • ${data.length} total`}
            </div>
            
            {(selectedCount > 0 || !isMobile) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileActions(!showMobileActions)}
                className="h-8"
              >
                {showMobileActions ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
                <span className="ml-2">Actions</span>
              </Button>
            )}
          </div>

          {/* Mobile actions panel */}
          {showMobileActions && (
            <div className="flex flex-col space-y-2 rounded-lg border bg-card p-3 md:hidden">
              {selectedCount > 0 && (
                <Button
                  aria-label="Delete Orders"
                  variant={"destructive"}
                  size="sm"
                  onClick={() => onDeleteOrder()}
                  disabled={isDeletingOrder}
                  className="w-full justify-start"
                >
                  {isDeletingOrder ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="size-4 mr-2" />
                  )}
                  Delete Selected ({selectedCount})
                </Button>
              )}
              <div className="pt-2">
                <DataTableViewOptions table={table} />
              </div>
            </div>
          )}
        </div>

        {/* Responsive table wrapper with enhanced mobile handling */}
        <div className="rounded-md border overflow-hidden">
          {/* Mobile: Show summary when data exists */}
          {isMobile && data.length > 0 && (
            <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b md:hidden">
              Swipe horizontally to view all columns
            </div>
          )}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          className="whitespace-nowrap text-xs md:text-sm min-w-[100px] first:min-w-[50px]"
                        >
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
                      className="group"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          className="whitespace-nowrap text-xs md:text-sm min-w-[100px] first:min-w-[50px] py-3 md:py-4"
                        >
                          <div className="max-w-[150px] md:max-w-none truncate">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 md:h-24 text-center text-sm md:text-base"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div>No results found.</div>
                        {globalFilter && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setGlobalFilter("")}
                            className="text-xs"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
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