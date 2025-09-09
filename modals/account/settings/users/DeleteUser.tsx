"use client";

import { useModal } from "@/hooks/use-modal-store";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { deleteUserAction } from "@/app/account/settings/action";
import { useRouter } from "next/navigation";

export default function DeleteUser() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const isModalOpen = isOpen && type === "deleteUser";
  const { user } = data;

  const onDeleteUser = async () => {
    setIsDeleteUser(true);
    let userIds: string[] = [];
    try {
      if (user) {
        userIds = [...userIds, user.id];
      }
      const { errorMessage, message } = await deleteUserAction(userIds);
      if (errorMessage) {
        return toast.error(errorMessage, {
          position: "top-center",
        });
      }

      router.refresh();
      onClose();
      return toast.success(message, {
        position: "top-center",
      });
    } finally {
      onClose();
      setIsDeleteUser(false);
    }
  };

  const onCloseModal = () => {
    if (isDeleteUser) {
      return;
    }
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={() => onCloseModal()}>
      <DialogOverlay className="bg-background/60 dark:bg-background/20 backdrop-blur-xs" />
      <DialogContent>
        <DialogHeader className="items-center">
          <Trash2 className="w-20 h-auto text-destructive" />
          <DialogTitle className="text-center text-3xl">
            You're about to delete user{" "}
            <span className="text-destructive">{user?.username}</span>
            <br />
            Are you sure?
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Button
            onClick={() => onClose()}
            className="w-full cursor-pointer"
            variant="outline"
            disabled={isDeleteUser}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onDeleteUser()}
            className="w-full cursor-pointer gap-1.5"
            variant="destructive"
            disabled={isDeleteUser}
          >
            {isDeleteUser ? (
              <>
                <Loader2 className="w-5 animate-spin" />
                <span>Deleting user...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
