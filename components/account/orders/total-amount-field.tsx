import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateOrderFormValues } from "@/types/orders";

interface TotalAmountFieldProps {
  control: Control<CreateOrderFormValues>;
}

export function TotalAmountField({ control }: TotalAmountFieldProps) {
  return (
    <FormField
      control={control}
      name="totalAmount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Total Amount</FormLabel>
          <FormControl>
            <Input
              type="text"
              readOnly
              placeholder="0.00"
              {...field}
              className="bg-muted"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
