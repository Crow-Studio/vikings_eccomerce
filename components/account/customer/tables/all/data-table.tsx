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
  const [isMobile, setIsMobile] = React.useState(false);

  // Check for mobile viewport
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Mobile card view component
  const MobileCard = ({ row }: { row: any }) => {
    const customer = row.original as Customer;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Row selection checkbox */}
            <div className="flex items-center">
              {row.getVisibleCells().find((cell: any) => cell.column.id === 'select') && (
                <div className="scale-90">
                  {flexRender(
                    row.getVisibleCells().find((cell: any) => cell.column.id === 'select')?.column.columnDef.cell,
                    row.getVisibleCells().find((cell: any) => cell.column.id === 'select')?.getContext()
                  )}
                </div>
              )}
            </div>
            {customer.avatar && (
              <img 
                src={customer.avatar} 
                alt={customer.full_name || customer.email}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-medium text-sm text-gray-900">
                {customer.full_name || customer.email}
              </h3>
              <p className="text-xs text-gray-500">{customer.email}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center space-x-2">
            {row.getVisibleCells().find((cell: any) => cell.column.id === 'actions') && (
              flexRender(
                row.getVisibleCells().find((cell: any) => cell.column.id === 'actions')?.column.columnDef.cell,
                row.getVisibleCells().find((cell: any) => cell.column.id === 'actions')?.getContext()
              )
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          {customer.phone && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Phone:</span>
              <span className="text-xs text-gray-900">{customer.phone}</span>
            </div>
          )}
          {customer.city && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">City:</span>
              <span className="text-xs text-gray-900">{customer.city}</span>
            </div>
          )}
          {customer.country && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Country:</span>
              <span className="text-xs text-gray-900">{customer.country}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 mr-2">Address:</span>
              <span className="text-xs text-gray-900 text-right flex-1">{customer.address}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Input
            placeholder="Filter customer name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-full sm:w-auto"
          />
          <div className="flex items-center gap-x-2 sm:gap-x-3 w-full sm:w-auto justify-end">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                aria-label="Delete Customers"
                variant={"destructive"}
                size="sm"
                className="h-8 text-xs px-2 sm:px-3"
                onClick={() => onDeleteCustomer()}
                disabled={isDeletingCustomer}
              >
                {isDeletingCustomer ? (
                  <Loader2 className="size-3 sm:size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-3 sm:size-4" />
                )}
                <span className="hidden xs:inline ml-1">Remove</span>
                <span className="ml-1">({table.getFilteredSelectedRowModel().rows.length})</span>
              </Button>
            )}
            <DataTableViewOptions table={table} />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className={`${isMobile ? 'hidden' : 'block'} rounded-md border overflow-hidden`}>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead 
                          key={header.id} 
                          className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-3"
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
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4 py-3 max-w-[120px] sm:max-w-[200px] lg:max-w-none overflow-hidden text-ellipsis"
                        >
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
                      className="h-24 text-center text-xs sm:text-sm"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className={`${isMobile ? 'block' : 'hidden'}`}>
          {table.getRowModel().rows?.length ? (
            <div className="space-y-3">
              {table.getRowModel().rows.map((row) => (
                <MobileCard key={row.id} row={row} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No customers found.</p>
            </div>
          )}
        </div>
      </div>
      
      <DataTablePagination table={table} />
    </div>
  );
}