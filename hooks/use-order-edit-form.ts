import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { OrderStatus } from "@/database/schema";
import { CreateOrderFormValues, createOrderSchema } from "@/types/orders";
import { useRouter } from "next/navigation";
import { createOrderAction, updateOrderAction } from "@/app/account/orders/action";
import { toast } from "sonner";
import { useModal } from "./use-modal-store";
import isEqual from "lodash/isEqual";

export function useOrderEditForm() {
    const router = useRouter();
    const { onClose, data: { order } } = useModal();
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    const defaultValues: CreateOrderFormValues = {
        customerId: order ? order.customer.id : "",
        status: order ? order.status : OrderStatus.PENDING,
        items: order
            ? order.items.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl ?? "",
            }))
            : [],
        totalAmount: order ? order.total_amount : "0",
    };

    const form = useForm<CreateOrderFormValues>({
        resolver: zodResolver(createOrderSchema),
        defaultValues,
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchedValues = form.watch();
    const initialValuesRef = useRef(defaultValues);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setHasChanges(!isEqual(watchedValues, initialValuesRef.current));
    }, [watchedValues]);

    useEffect(() => {
        const total = watchedValues.items.reduce((sum, item) => {
            return sum + Number(item.price) * item.quantity;
        }, 0);
        form.setValue("totalAmount", total.toFixed(2));
    }, [watchedValues.items, form]);

    const handleSubmit = async (values: CreateOrderFormValues) => {
        setIsUpdatingOrder(true);
        const { message, errorMessage } = await updateOrderAction({
            ...values,
            id: order?.id as string
        });

        if (errorMessage) {
            setIsUpdatingOrder(false);
            return toast.error(errorMessage, { position: "top-center" });
        }

        form.reset(values);
        router.refresh();
        setIsUpdatingOrder(false);
        onClose();

        return toast.success(message, { position: "top-center" });
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
        isUpdatingOrder,
        hasChanges,
    };
}
