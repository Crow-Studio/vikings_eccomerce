import CreateOrderForm from "@/components/account/orders/create-order-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";

export default function CreateOrder() {
  const {
    isOpen,
    onClose,
    type,
    data: { customers, products },
  } = useModal();

  const isModalOpen = isOpen && type === "createOrder";

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
          <SheetTitle>Create new order</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new order.
          </SheetDescription>
        </SheetHeader>
        <CreateOrderForm customers={customers!} products={products!} />
      </SheetContent>
    </Sheet>
  );
}
