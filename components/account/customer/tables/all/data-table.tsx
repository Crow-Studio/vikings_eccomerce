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
import { useRouter } from "next/navigation";
import { Customer, CustomerEditInfo } from "@/types/customers";
import { deleteCustomersAction } from "@/app/account/customers/action";

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
  const [isDeletingCustomer, setIsDeletingCustomer] = React.useState(false);
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
  const onDeleteCustomer = async () => {
    const rows = table.getFilteredSelectedRowModel().rows;
    let customers: CustomerEditInfo[] = [];

    if (rows.length > 0) {
      customers = rows.map(({ original }) => {
        const customer = original as Customer;
        return {
          id: customer.id,
          address: customer.address!,
          avatar: customer.avatar,
          city: customer.city!,
          country: customer.country!,
          email: customer.email,
          full_name: customer.email,
          phone: customer.phone!,
        };
      });
    }
    toast.promise(
      (async () => {
        setIsDeletingCustomer(true);
        const { message, errorMessage } = await deleteCustomersAction(
          customers
        );
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting customers...",
        success: "Customers deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete customers",
        finally() {
          setIsDeletingCustomer(false);
          router.refresh();
        },
        position: "top-center",
      }
    );
  };
  return (
    <div className="space-y-4 max-w-sm sm:max-w-2xl md:max-w-2xl lg:max-w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-y-2 md:gap-y-0 md:flex-row md:items-center md:justify-between">
          <Input
            placeholder="Filter customer name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-x-3">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                aria-label="Delete Customers"
                variant={"destructive"}
                className="h-8 lg:flex"
                onClick={() => onDeleteCustomer()}
                disabled={isDeletingCustomer}
              >
                {isDeletingCustomer ? (
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
        <div className="rounded-md border">
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