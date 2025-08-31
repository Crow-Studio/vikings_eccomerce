import { z } from "zod";
export const addProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(60, "Name should be under 60 characters"),
  price: z
    .string()
    .min(1, "Base price is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(500, "Description should be under 500 characters"),
  visibility: z.enum(["active", "inactive"], {
    required_error: "Visibility status is required",
  }),
  category: z.string().min(1, "Category is required"),
  images: z
    .array(
      z.object({
        id: z.string(),
        file: z.instanceof(File),
        preview: z.string(),
      })
    )
    .min(1, "At least one product image is required"),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        title: z.string().min(1, "Option title is required"),
        values: z.array(z.string()).min(1, "At least one value is required"),
      })
    )
    .optional(),
  generatedVariants: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        sku: z.string().optional(),
        inventory: z.string().optional(),
        attributes: z.record(z.string()),
      })
    )
    .optional(),
});
export const editProductFormSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(60, "Name should be under 60 characters"),
  price: z
    .string()
    .min(1, "Base price is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(500, "Description should be under 500 characters"),
  visibility: z.enum(["active", "inactive"], {
    required_error: "Visibility status is required",
  }),
  category: z.string().min(1, "Category is required"),
  images: z
    .array(
      z.object({
        id: z.string(),
        file: z.instanceof(File).optional().nullable(),
        preview: z.string(),
      })
    )
    .min(1, "At least one product image is required"),
  hasVariants: z.boolean(),
  variants: z
    .array(
      z.object({
        title: z.string().min(1, "Option title is required"),
        values: z.array(z.string()).min(1, "At least one value is required"),
      })
    )
    .optional(),
  generatedVariants: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        sku: z.string().optional(),
        inventory: z.string().optional(),
        attributes: z.record(z.string()),
      })
    )
    .optional(),
});