"use client";

import { useModal } from "@/hooks/use-modal-store";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmojiSadFace } from "@/components/svgs/EmojiSadFace";
import { Button } from "@/components/ui/button";
import { signoutAction } from "@/app/account/action";
import { toast } from "sonner";

export default function Signout() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "signoutUser";

  const onSignoutUSer = async () => {
    try {
      const { message } = await signoutAction();

      if (message) {
        return toast.error(message, {
          position: "top-center",
        });
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-background/60 dark:bg-background/20 backdrop-blur-xs" />
      <DialogContent>
        <DialogHeader className="items-center">
          <EmojiSadFace className="w-20 h-auto" />
          <DialogTitle className="text-center text-3xl">
            Oh no! You're leaving... <br />
            Are you sure?
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Button
            onClick={() => onClose()}
            className="w-full cursor-pointer"
            variant="outline"
          >
            Naah, just kidding!
          </Button>
          <Button
            onClick={() => onSignoutUSer()}
            className="w-full cursor-pointer"
            variant="destructive"
          >
            Yes, sign in me out!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
