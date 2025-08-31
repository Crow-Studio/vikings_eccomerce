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
import { Customer, CustomerEditInfo } from "@/types/customers";
import { useModal } from "@/hooks/use-modal-store";
import { deleteCustomersAction } from "@/app/account/customers/action";

interface Props {
  customer: Customer;
}

export default function DataTableActions({ customer }: Props) {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  const customers: CustomerEditInfo[] = [];

  const onDeleteCustomer = async () => {
    customers.push({
      id: customer.id,
      address: customer.address!,
      avatar: customer.avatar,
      city: customer.city!,
      country: customer.country!,
      email: customer.email,
      full_name: customer.email,
      phone: customer.phone!,
    });

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
          onClick={() =>
            onOpen("editCustomer", {
              customer,
            })
          }
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
