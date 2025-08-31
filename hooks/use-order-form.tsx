import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { OrderStatus } from "@/database/schema";
import { CreateOrderFormValues, createOrderSchema } from "@/types/orders";

export function useOrderForm() {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerId: "",
      status: OrderStatus.PENDING,
      items: [],
      totalAmount: "0",
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  useEffect(() => {
    const total = watchedItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);
    form.setValue("totalAmount", total.toFixed(2));
  }, [watchedItems, form]);

  const handleSubmit = async (values: CreateOrderFormValues) => {
    console.log("Order submitted:", values);
    // Add your submission logic here
  };

  const handleProductRemove = (index: number) => {
    remove(index);
  };

  return {
    form,
    fields,
    append,
    remove: handleProductRemove,
    update,
    handleSubmit,
  };
}
