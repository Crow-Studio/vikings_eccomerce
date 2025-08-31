import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Customer } from "@/types/customers";

interface CustomersDataTableProps {
  customers: Customer[];
}
export default async function CustomersDataTable({
  customers,
}: CustomersDataTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
