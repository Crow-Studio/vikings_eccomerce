"use client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";
export default function NewCustomerButton() {
  const { onOpen } = useModal();
  return (
    <Button onClick={() => onOpen("newCustomer")}>
      <Plus />
      New Customer
    </Button>
  );
}
