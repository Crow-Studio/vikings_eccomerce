import EditCustomerForm from "@/components/account/customer/edit-customer-form";
import NewCustomerForm from "@/components/account/customer/new-customer-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";

export default function EditCustomer() {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "editCustomer";

  return (
    <Sheet open={isModalOpen} onOpenChange={() => onClose()}>
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
          <SheetTitle>Update customer info</SheetTitle>
          <SheetDescription>
            Edit the customer's information for your Vikings store records and
            orders.
          </SheetDescription>
        </SheetHeader>
        <EditCustomerForm />
      </SheetContent>
    </Sheet>
  );
}
