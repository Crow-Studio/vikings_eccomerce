import { useState } from "react";
import { UseFieldArrayAppend } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn, truncateText } from "@/lib/utils";
import { IProduct } from "@/types";
import { CreateOrderFormValues } from "@/types/orders";
import Image from "next/image";

interface ProductSelectorProps {
  products: IProduct[];
  selectedItems: CreateOrderFormValues["items"];
  onAppend: UseFieldArrayAppend<CreateOrderFormValues, "items">;
  onRemove: (index: number) => void;
  isSavingToDB: boolean;
}

export function ProductSelector({
  products,
  selectedItems,
  onAppend,
  onRemove,
  isSavingToDB,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleProductSelect = (product: IProduct) => {
    const existingIndex = selectedItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingIndex >= 0) {
      onRemove(existingIndex);
    } else {
      onAppend({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Products</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={isSavingToDB} asChild>
          <Button variant="outline" className="justify-between w-full">
            {selectedItems.length > 0
              ? `${selectedItems.length} ${
                  selectedItems.length > 1 ? "Products" : "Product"
                } Selected`
              : "Add product"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandList>
              <CommandEmpty>No product found.</CommandEmpty>
              <CommandGroup>
                {products?.map((p) => {
                  const isSelected = selectedItems.some(
                    (item) => item.productId === p.id
                  );
                  return (
                    <CommandItem
                      key={p.id}
                      value={p.name}
                      onSelect={() => handleProductSelect(p)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded object-cover"
                          width={24}
                          height={24}
                        />
                        <div>
                          <p className="font-medium">
                            {truncateText(p.name, 25)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${p.price}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
