import { columns } from "./columns";
import { DataTable } from "./data-table";
import { CategoryWithProducts } from "@/lib/server/utils";

interface CategoriesDataTableProps {
  categories: CategoryWithProducts[];
}
export default async function CategoriesDataTable({
  categories,
}: CategoriesDataTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
