"use client"

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { Plus } from "lucide-react";
import React from "react";

export default function NewCategoryButton() {
  const { onOpen } = useModal();
  const onAddNewCategory = () => {
    onOpen("newCategory");
  };
  return (
    <Button
      onClick={() => onAddNewCategory()}
      className="w-full sm:w-fit"
    >
      <Plus />
      New Category
    </Button>
  );
}
