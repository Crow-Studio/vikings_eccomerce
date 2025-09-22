import { User } from "@/database/schema";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface UsersDataTableProps {
  users: User[];
}
export default async function UsersDataTable({ users }: UsersDataTableProps) {
  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
