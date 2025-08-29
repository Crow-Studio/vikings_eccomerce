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

interface Props {
  product: DBProduct;
}

export default function DataTableActions({ product }: Props) {
  const router = useRouter();

  const onEditProduct = async () => {
    return router.push(`/account/products/${product.id}/edit`);
  };
  const onDeleteProduct = async () => {
    console.log("Product ID", product.id);
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
        >
          <Edit />
          Edit Product
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteProduct()}
          className="cursor-pointer"
        >
          <Trash />
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
