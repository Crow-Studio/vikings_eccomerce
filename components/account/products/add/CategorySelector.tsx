import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CategorySelectorProps } from "@/types";
import { useModal } from "@/hooks/use-modal-store";
export default function CategorySelector({
  value,
  onChange,
  categories,
  isAddingProduct
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const { onOpen } = useModal();
  const onAddNewCategory = () => {
    onOpen("newCategory");
  };
  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between"
            disabled={isAddingProduct}
          >
            {value
              ? categories.find((category) => category.id === value)?.name
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === category.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {category.name}
                </CommandItem>
              ))}
              <CommandItem
                className="cursor-pointer"
                onClick={() => onAddNewCategory()}
                onSelect={() => {
                  onAddNewCategory();
                  setOpen(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new category
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
