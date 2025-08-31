import CreateOrderForm from "@/components/account/orders/create-order-form";
import EditOrderForm from "@/components/account/orders/edit/edit-order.form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";

export default function EditOrder() {
  const {
    isOpen,
    onClose,
    type,
    data: { order, customers, products },
  } = useModal();

  const isModalOpen = isOpen && type === "editOrder";

  return (
    <Sheet open={isModalOpen} onOpenChange={onClose}>
      <SheetContent
        className="overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <SheetHeader>
          <SheetTitle>Update order info</SheetTitle>
          <SheetDescription>
            Update the order details below and save your changes.
          </SheetDescription>
        </SheetHeader>
        <EditOrderForm customers={customers!} products={products!} />
      </SheetContent>
    </Sheet>
  );
}
