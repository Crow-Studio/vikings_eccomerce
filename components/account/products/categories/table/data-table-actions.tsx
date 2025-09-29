import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { CategoryWithProducts } from "@/lib/server/utils";
import { useModal } from "@/hooks/use-modal-store";

interface Props {
  category: CategoryWithProducts;
}
export default function DataTableActions({ category }: Props) {
  const router = useRouter();
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const { onOpen } = useModal()

  const onEditCategory = () => {
    return onOpen('editCategory', {
      category,
    })
  };
  const onDeleteCategory = async () => {
    toast.promise(
      (async () => {
        setIsDeletingProduct(true);
        const res = await fetch("/api/account/products/categories/delete", {
          method: "DELETE",
          body: JSON.stringify({
            categoriesIds: [
              category.id
            ]
          }),
        });

        const response = await res.json()

        if (!res.ok) {
          throw new Error(response.error);
        }
        return response.message;
      })(),
      {
        loading: "Deleting product...",
        success: "Product deleted successfully!",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete product",
        finally() {
          setIsDeletingProduct(false);
          router.refresh()
        },
        position: "top-center",
      }
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEditCategory()}
          className="cursor-pointer"
          disabled={isDeletingProduct}
        >
          <Edit />
          Edit Category
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteCategory()}
          disabled={isDeletingProduct}
          className="cursor-pointer"
        >
          <Trash />
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
