import NewCustomerForm from "@/components/account/customer/new-customer-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";
export default function NewCustomer() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "newCustomer";
  return (
    <Sheet open={isModalOpen} onOpenChange={() => onClose()}>
      <SheetContent className="overflow-y-auto
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <SheetHeader>
          <SheetTitle>Add new customer</SheetTitle>
          <SheetDescription>
            Add a new customer to your Vikings store for orders and records.
          </SheetDescription>
        </SheetHeader>
        <NewCustomerForm />
      </SheetContent>
    </Sheet>
  );
}
