import { DBProduct } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
interface ProductsDataTableProps {
  products: DBProduct[];
}
export default async function ProductsDataTable({
  products,
}: ProductsDataTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={products} />
    </div>
  );
}
