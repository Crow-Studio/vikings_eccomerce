"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddNewCategory() {
  const { type, isOpen, onClose } = useModal();
  const [category, setCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const router = useRouter();
  const isModalOpen = type === "newCategory" && isOpen;
  const onAddNewCategory = async () => {
    setIsAddingCategory(true);
    if (category.trim() === "") {
      setIsAddingCategory(false);
      return toast.error("Category name cannot be empty", {
        position: "top-center",
      });
    }

    const res = await fetch("/api/account/products/categories", {
      method: "POST",
      body: JSON.stringify({
        category,
      }),
    });

    const response = await res.json()

    if (!res.ok) {
      setIsAddingCategory(false);
      return toast.error(response.error, {
        position: "top-center",
      });
    }

    router.refresh();
    setCategory("");
    setIsAddingCategory(false);
    onClose();

    return toast.success(response.message, {
      position: "top-center",
    });
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add new category
        </DialogDescription>
        <div className="grid gap-y-3 py-4">
          <Input
            placeholder="Enter category name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isAddingCategory}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddNewCategory();
              }
            }}
          />
          <div className="grid gap-y-1.5">
            <Button
              onClick={() => onAddNewCategory()}
              className="cursor-pointer"
              disabled={isAddingCategory}
            >
              {isAddingCategory && <Loader2 className="animate-spin size-4" />}
              Add Category
            </Button>
            <Button
              variant="outline"
              onClick={() => onClose()}
              className="cursor-pointer"
              disabled={isAddingCategory}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
