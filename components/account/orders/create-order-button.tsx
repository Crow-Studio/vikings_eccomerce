"use client";

import { Button } from "@/components/ui/button";
import { Customer } from "@/database/schema";
import { useModal } from "@/hooks/use-modal-store";
import { IProduct } from "@/types";
import { Plus } from "lucide-react";

interface Props {
  customers: Customer[];
  products: IProduct[]
}

export default function CreateOrderButton({ customers, products }: Props) {
  const { onOpen } = useModal();
  return (
    <Button
      onClick={() =>
        onOpen("createOrder", {
          customers,
          products
        })
      }
    >
      <Plus />
      Create Order
    </Button>
  );
}
