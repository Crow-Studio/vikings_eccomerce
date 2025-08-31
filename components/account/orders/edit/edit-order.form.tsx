import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateOrderFormProps } from "@/types/orders";
import { Loader2 } from "lucide-react";
import { useOrderEditForm } from "@/hooks/use-order-edit-form";
import { CustomerSelector } from "../customer-selector";
import { ProductSelector } from "../product-selector";
import { OrderItem } from "../order-item";
import { TotalAmountField } from "../total-amount-field";
import { OrderStatus } from "@/database/schema";

export default function EditOrderForm({
  customers,
  products,
}: CreateOrderFormProps) {
  const {
    form,
    fields,
    append,
    remove,
    update,
    handleSubmit,
    isUpdatingOrder,
    hasChanges,
  } = useOrderEditForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-4 -mt-4 mb-3"
      >
        <CustomerSelector
          control={form.control}
          customers={customers}
          isSavingToDB={isUpdatingOrder}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isUpdatingOrder} className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProductSelector
          products={products}
          selectedItems={fields}
          onAppend={append}
          onRemove={remove}
          isSavingToDB={isUpdatingOrder}
        />

        <div className="space-y-4">
          {fields.map((item, index) => (
            <OrderItem
              key={item.id}
              item={item}
              index={index}
              control={form.control}
              onRemove={remove}
              onUpdate={update}
              isSavingToDB={isUpdatingOrder}
            />
          ))}
        </div>

        <TotalAmountField control={form.control} />

        <Button
          type="submit"
          disabled={fields.length === 0 || isUpdatingOrder || !hasChanges}
          className="w-full"
        >
          {isUpdatingOrder && <Loader2 className="animate-spin" />}
          Update Order
        </Button>
      </form>
    </Form>
  );
}
