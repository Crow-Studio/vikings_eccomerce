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
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditCategory() {
  const { type, isOpen, onClose, data } = useModal();
  const [category, setCategory] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const router = useRouter();
  const isModalOpen = type === "editCategory" && isOpen;
  const { category: modalCategory } = data;

  useEffect(() => {
    if (modalCategory?.name) {
      setCategory(modalCategory.name as string);
    }
  }, [modalCategory]);

  const onEditCategory = async () => {
    setIsEditingCategory(true);

    if (category.trim() === "") {
      setIsEditingCategory(false);
      return toast.error("Category name cannot be empty", {
        position: "top-center",
      });
    }

    try {
      const res = await fetch(
        `/api/account/products/categories/${modalCategory?.id}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: category,
          }),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        setIsEditingCategory(false);
        return toast.error(response.error, {
          position: "top-center",
        });
      }

      router.refresh();
      setIsEditingCategory(false);
      onClose();

      return toast.success(response.message, {
        position: "top-center",
      });
    } catch {
      setIsEditingCategory(false);
      return toast.error("An error occurred while updating the category", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription className="sr-only">
            Update category name
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-y-3 py-4">
          <Input
            placeholder="Enter category name"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isEditingCategory}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEditCategory();
              }
            }}
          />
          <div className="grid gap-y-1.5">
            <Button
              onClick={() => onEditCategory()}
              className="cursor-pointer"
              disabled={isEditingCategory}
            >
              {isEditingCategory && (
                <Loader2 className="animate-spin size-4 mr-2" />
              )}
              Update Category
            </Button>
            <Button
              variant="outline"
              onClick={() => onClose()}
              className="cursor-pointer"
              disabled={isEditingCategory}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
