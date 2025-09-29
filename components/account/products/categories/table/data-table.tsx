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

  const onDeleteCategories = async () => {
    const rows = table.getFilteredSelectedRowModel().rows;
    let selectedCategoriesIds: string[] = [];
    if (rows.length > 0) {
      selectedCategoriesIds = rows.map(({ original }) => {
        const product = original as DBProduct;
        return product.id;
      });
    }
    toast.promise(
      (async () => {
        setIsDeletingProduct(true);

        const res = await fetch("/api/account/products/categories/delete", {
          method: "DELETE",
          body: JSON.stringify({
            categoriesIds: selectedCategoriesIds,
          }),
        });

        const response = await res.json()

        if (!res.ok) {
          throw new Error(response.error);
        }
        return response.message;
      })(),
      {
        loading: "Deleting categories...",
        success: "Categories deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete categories",
        finally() {
          setIsDeletingProduct(false);
          router.refresh();
        },
        position: "top-center",
      }
    );
  };
  return (
    <div className="space-y-4 relative flex flex-col gap-4 overflow-auto">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Filter category name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-x-3">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                aria-label="Delete Products"
                variant={"destructive"}
                className="h-8 lg:flex"
                onClick={() => onDeleteCategories()}
                disabled={isDeletingProduct}
              >
                {isDeletingProduct ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Remove ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}
            <DataTableViewOptions table={table} />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                      <TableCell key={cell.id}>
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
      <DataTablePagination table={table} />
    </div>
  );
}
