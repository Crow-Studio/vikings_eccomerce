import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { CategorySelectorProps } from "@/types";

const SAMPLE_CATEGORIES = [
  "Electronics",
  "Clothing & Accessories",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Toys & Games",
  "Food & Beverages",
  "Automotive",
  "Office Supplies",
];

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddNewCategory = () => {
    if (
      newCategoryName.trim() &&
      !categories.includes(newCategoryName.trim())
    ) {
      const newCategory = newCategoryName.trim();
      setCategories([...categories, newCategory]);
      onChange(newCategory);
      setNewCategoryName("");
      setNewCategoryOpen(false);
      setOpen(false);
    }
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
          >
            {value
              ? categories.find((category) => category === value)
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
                  key={category}
                  value={category}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === category ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddNewCategory();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
