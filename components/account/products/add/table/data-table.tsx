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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DBProduct } from "@/types";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/app/account/products/add/action";

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
  const [isDeletingProduct, setIsDeletingProduct] = React.useState(false);
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  const onDeleteProduct = async () => {
    const rows = table.getFilteredSelectedRowModel().rows;
    let selectedProductsIds: string[] = [];
    if (rows.length > 0) {
      selectedProductsIds = rows.map(({ original }) => {
        const product = original as DBProduct;
        return product.id;
      });
    }

    toast.promise(
      (async () => {
        setIsDeletingProduct(true);
        const { message, errorMessage } = await deleteProductAction(
          selectedProductsIds
        );
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting products...",
        success: "Products deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete products",
        finally() {
          setIsDeletingProduct(false);
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
            placeholder="Filter product name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full max-w-sm"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                aria-label="Delete Products"
                variant={"destructive"}
                className="h-8 flex-shrink-0"
                onClick={() => onDeleteProduct()}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? (
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
            table.getRowModel().rows.map((row) => (
              <div 
                key={row.id} 
                className="rounded-lg border bg-card p-4 space-y-2"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  // Skip rendering for less important columns on mobile
                  const isImportant = ['name', 'price', 'status', 'actions', 'select'].some(
                    col => cell.column.id.toLowerCase().includes(col.toLowerCase())
                  );
                  
                  if (!isImportant) return null;

                  // Better header text extraction
                  const header = cell.column.columnDef.header;
                  let headerText = cell.column.id;
                  
                  if (typeof header === 'string') {
                    headerText = header;
                  } else if (header && typeof header === 'function') {
                    // Find the corresponding header from the table header groups
                    const headerGroup = table.getHeaderGroups()[0];
                    const correspondingHeader = headerGroup?.headers.find(h => h.column.id === cell.column.id);
                    
                    if (correspondingHeader) {
                      try {
                        const renderedHeader = flexRender(header, correspondingHeader.getContext());
                        if (typeof renderedHeader === 'string') {
                          headerText = renderedHeader;
                        } else {
                          // Fallback to formatted column ID
                          headerText = cell.column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        }
                      } catch {
                       
                        headerText = cell.column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      }
                    } else {
                      
                      headerText = cell.column.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    }
                  }
                  
                  return (
                    <div key={cell.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {headerText}
                      </span>
                      <div className="text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
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