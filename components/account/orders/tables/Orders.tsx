import { Order } from "@/types/orders";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface OrdersDataTableProps {
  orders: Order[];
}
export default async function OrdersDataTable({
  orders,
}: OrdersDataTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
