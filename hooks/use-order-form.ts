import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/database/schema";
import { CreateOrderFormValues, createOrderSchema } from "@/types/orders";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/app/account/orders/action";
import { toast } from "sonner";
import { useModal } from "./use-modal-store";

export function useOrderForm() {
  const router = useRouter();
  const { onClose } = useModal()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

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
    setIsCreatingOrder(true);
    const { message, errorMessage } = await createOrderAction(values);

    if (errorMessage) {
      setIsCreatingOrder(false);

      return toast.error(errorMessage, {
        position: "top-center",
      });
    }

    form.reset();
    router.refresh();
    setIsCreatingOrder(false);
    onClose()

    return toast.success(message, {
      position: "top-center",
    });
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
    isCreatingOrder,
  };
}
