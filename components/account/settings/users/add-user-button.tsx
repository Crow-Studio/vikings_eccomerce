"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";

export default function AddUserButton() {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen("addNewUser")}>
      <Plus />
      Create User
    </Button>
  );
}
