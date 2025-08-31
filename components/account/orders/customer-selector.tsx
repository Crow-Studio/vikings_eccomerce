import { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { cn, getCustomerAvatar } from "@/lib/utils";
import { Customer } from "@/database/schema";
import { CreateOrderFormValues } from "@/types/orders";
import Image from "next/image";

interface CustomerSelectorProps {
  control: Control<CreateOrderFormValues>;
  customers: Customer[];
  isSavingToDB: boolean
}

export function CustomerSelector({
  control,
  customers,
  isSavingToDB
}: CustomerSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="customerId"
      render={({ field }) => {
        const selectedCustomer = customers?.find((c) => c.id === field.value);

        return (
          <FormItem className="flex flex-col">
            <FormLabel>Customer</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger disabled={isSavingToDB} asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value && selectedCustomer ? (
                      <div className="flex items-center gap-2">
                        {selectedCustomer.avatar ? (
                          <Image
                            src={selectedCustomer.avatar}
                            alt={selectedCustomer.full_name}
                            className="w-6 h-6 rounded-full object-cover"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center">
                            {getCustomerAvatar(selectedCustomer)}
                          </div>
                        )}
                        <span>{selectedCustomer.full_name}</span>
                      </div>
                    ) : (
                      <>
                        <span>Select a customer</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandList>
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customers?.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.full_name}
                          onSelect={() => {
                            if (field.value === c.id) {
                              field.onChange("");
                            } else {
                              field.onChange(c.id);
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              c.id === field.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2">
                            {c.avatar ? (
                              <Image
                                src={c.avatar}
                                alt={c.full_name}
                                className="w-6 h-6 rounded-full object-cover"
                                width={24}
                                height={24}
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center">
                                {getCustomerAvatar(c)}
                              </div>
                            )}
                            <span>{c.full_name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
