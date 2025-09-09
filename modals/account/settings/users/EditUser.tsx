import EditUserForm from "@/components/account/settings/users/edit-user-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

export default function EditUser() {
  const { isOpen, onClose, type, data } = useModal();
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  const isModalOpen = isOpen && type === "editUser";
  const { user } = data

  const onCloseModal = () => {
    if (isUpdatingUser) {
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
          <SheetTitle>Edit user info</SheetTitle>
          <SheetDescription>
            Edit the user's information for your Vikings store.
          </SheetDescription>
        </SheetHeader>
        <EditUserForm
          isUpdatingUser={isUpdatingUser}
          setIsUpdatingUser={setIsUpdatingUser}
          onCloseModal={onCloseModal}
          user={user!}
        />
      </SheetContent>
    </Sheet>
  );
}
