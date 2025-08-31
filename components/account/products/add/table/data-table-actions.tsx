import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DBProduct } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { deleteProductAction } from "@/app/account/products/add/action";
interface Props {
  product: DBProduct;
}
export default function DataTableActions({ product }: Props) {
  const router = useRouter();
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const onEditProduct = async () => {
    return router.push(`/account/products/${product.id}/edit`);
  };
  const onDeleteProduct = async () => {
    toast.promise(
      (async () => {
        setIsDeletingProduct(true);
        const { message, errorMessage } = await deleteProductAction([
          product.id,
        ]);
        if (errorMessage) throw new Error(errorMessage);
        return message;
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
          onClick={() => onEditProduct()}
          className="cursor-pointer"
          disabled={isDeletingProduct}
        >
          <Edit />
          Edit Product
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteProduct()}
          disabled={isDeletingProduct}
          className="cursor-pointer"
        >
          <Trash />
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
