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
import { EmojiSadFace } from "@/components/svgs/EmojiSadFace";
import { Button } from "@/components/ui/button";
import { signoutAction } from "@/app/account/action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Signout() {
  const { isOpen, onClose, type } = useModal();
  const [isSigningOut, setIsSigningout] = useState(false);
  const isModalOpen = isOpen && type === "signoutUser";

  const onSignoutUser = async () => {
    setIsSigningout(true);
    try {
      const { errorMessage } = await signoutAction();

      if (errorMessage) {
        return toast.error(errorMessage, {
          position: "top-center",
        });
      }
    } finally {
      onClose();
      setIsSigningout(false);
    }
  };

  return (
    <Dialog
      open={isModalOpen || isSigningOut ? false : true}
      onOpenChange={onClose}
    >
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
            disabled={isSigningOut}
          >
            Naah, just kidding!
          </Button>
          <Button
            onClick={() => onSignoutUser()}
            className="w-full cursor-pointer gap-1.5"
            variant="destructive"
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-5 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <span>Yes, sign in me out!</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
