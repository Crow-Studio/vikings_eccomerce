import { z } from "zod";

export const addProductFormSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required!",
    }),
    price: z.string().optional(),
    description: z.string().optional(),
    hasVariants: z.boolean(),
    variants: z.array(
        z.object({
            title: z.string().min(1, "Variant title is required"),
            values: z.array(z.string()).min(1, "At least one value is required"),
        })
    ),
});