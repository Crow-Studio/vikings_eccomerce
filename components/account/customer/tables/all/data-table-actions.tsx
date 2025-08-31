import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { deleteProductAction } from "@/app/account/products/add/action";
import { Customer } from "@/types/customers";

interface Props {
  customer: Customer;
}
export default function DataTableActions({ customer }: Props) {
  const router = useRouter();
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  const onEditCustomer = async () => {
    return router.push(`/account/customer/${customer.id}/edit`);
  };
  const onDeleteCustomer = async () => {
    toast.promise(
      (async () => {
        setIsDeletingCustomer(true);
        const { message, errorMessage } = await deleteProductAction([
          customer.id,
        ]);
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting customer...",
        success: "Customer deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete customer",
        finally() {
          setIsDeletingCustomer(false);
          router.refresh();
        },
        position: "top-center",
      }
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEditCustomer()}
          className="cursor-pointer"
          disabled={isDeletingCustomer}
        >
          <Edit />
          Edit Customer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteCustomer()}
          disabled={isDeletingCustomer}
          className="cursor-pointer"
        >
          <Trash />
          Delete Customer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
