import CreateNewUserForm from "@/components/account/settings/users/create-new-user-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

export default function CreateUser() {
  const { isOpen, onClose, type } = useModal();
  const [isCreatingNewUser, setIsCreatingNewUser] = useState(false);

  const isModalOpen = isOpen && type === "addNewUser";

  const onCloseModal = () => {
    if (isCreatingNewUser) {
      return;
    }
    onClose();
  };

  return (
    <Sheet open={isModalOpen} onOpenChange={() => onCloseModal()}>
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
          <SheetTitle>Create new user</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new user.
          </SheetDescription>
        </SheetHeader>
        <CreateNewUserForm
          isCreatingNewUser={isCreatingNewUser}
          setIsCreatingNewUser={setIsCreatingNewUser}
          onCloseModal={onCloseModal}
        />
      </SheetContent>
    </Sheet>
  );
}
