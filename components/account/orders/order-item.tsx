import { Control, UseFieldArrayUpdate } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CreateOrderFormValues } from "@/types/orders";
import Image from "next/image";

interface OrderItemProps {
  item: CreateOrderFormValues["items"][0];
  index: number;
  control: Control<CreateOrderFormValues>;
  onRemove: (index: number) => void;
  onUpdate: UseFieldArrayUpdate<CreateOrderFormValues, "items">;
}

export function OrderItem({
  item,
  index,
  control,
  onRemove,
  onUpdate,
}: OrderItemProps) {
  return (
    <div className="flex items-center gap-4 border p-3 rounded-lg">
      <Image
        src={item.imageUrl}
        alt={item.productName}
        className="w-12 h-12 rounded object-cover flex-shrink-0"
        fill
      />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium text-sm" title={item.productName}>
              {item.productName}
            </p>
            <p className="text-xs text-muted-foreground">${item.price}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel>Qty</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    field.onChange(newQuantity);
                    onUpdate(index, {
                      ...item,
                      quantity: newQuantity,
                    });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
