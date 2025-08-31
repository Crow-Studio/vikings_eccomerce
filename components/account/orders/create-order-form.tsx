import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CreateOrderFormProps } from "@/types/orders";
import { useOrderForm } from "@/hooks/use-order-form";
import { CustomerSelector } from "./customer-selector";
import { ProductSelector } from "./product-selector";
import { OrderItem } from "./order-item";
import { TotalAmountField } from "./total-amount-field";

export default function CreateOrderForm({
  customers,
  products,
}: CreateOrderFormProps) {
  const { form, fields, append, remove, update, handleSubmit } = useOrderForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-4 -mt-4 mb-3"
      >
        <CustomerSelector control={form.control} customers={customers} />

        <ProductSelector
          products={products}
          selectedItems={fields}
          onAppend={append}
          onRemove={remove}
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
            />
          ))}
        </div>

        <TotalAmountField control={form.control} />

        <Button type="submit" disabled={fields.length === 0} className="w-full">
          Create Order
        </Button>
      </form>
    </Form>
  );
}
