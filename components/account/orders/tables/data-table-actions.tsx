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
import { useModal } from "@/hooks/use-modal-store";
import { Order } from "@/types/orders";
import { deleteOrdersAction } from "@/app/account/orders/action";

interface Props {
  order: Order;
}

export default function DataTableActions({ order }: Props) {
  const { onOpen } = useModal();
  const router = useRouter();
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);

  const ordersIds: string[] = [];

  const onDeleteOrder = async () => {
    ordersIds.push(order.id);
    toast.promise(
      (async () => {
        setIsDeletingOrder(true);
        const { message, errorMessage } = await deleteOrdersAction(ordersIds);
        if (errorMessage) throw new Error(errorMessage);
        return message;
      })(),
      {
        loading: "Deleting order..",
        success: "Order deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete order",
        finally() {
          setIsDeletingOrder(false);
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
            onOpen("editOrder", {
              order,
            })
          }
          className="cursor-pointer"
          disabled={isDeletingOrder}
        >
          <Edit />
          Edit Order
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteOrder()}
          disabled={isDeletingOrder}
          className="cursor-pointer"
        >
          <Trash />
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
