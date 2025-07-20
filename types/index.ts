import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { addProductFormSchema } from "./products/form";
import { Category, GeneratedVariants, ProductImage, Visibility } from "@/database/schema";

export type ModalType = "signoutUser" | "newCategory"

export interface ModalData { }

export interface ActionResult {
  message: string | null;
  errorMessage: string | null;
}

export interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email!",
  }),
  password: z.string().min(8, {
    message: "Password too short! 8 characters minimum",
  }),
});

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .min(8, {
      message: "Code shouldn't be less than 8 characters.",
    })
    .max(8, {
      message: "Code shouldn't be more than 8 characters.",
    }),
});

export interface VariantField {
  name: string;
  price: string;
  description: string;
  visibility: "active" | "inactive";
  category: string;
  images: {
    id: string;
    file: File;
    preview: string;
  }[];
  hasVariants: boolean;
  variants?: {
    values: string[];
    title: string;
  }[] | undefined;
  generatedVariants?: {
    name: string;
    price: string;
    attributes: Record<string, string>;
    sku?: string | undefined;
    inventory?: string | undefined;
  }[] | undefined;
}

export interface VariantCombination {
  name: string;
  attributes: Record<string, string>;
}

export interface VariantsConfigurationsProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
  hasVariants: boolean;
  fields: FieldArrayWithId<VariantField, "variants", "id">[];
  append: UseFieldArrayAppend<VariantField, "variants">;
  variantCombinations: VariantCombination[]
  remove: UseFieldArrayRemove
  isAddingProduct: boolean;
}

export interface GeneralInformationProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
  isAddingProduct: boolean
}
export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

export interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[]
  isAddingProduct: boolean
}

export interface ProductSettingsProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
  categories: Category[]
  isAddingProduct: boolean
}

export interface ProductImagesProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
  isAddingProduct: boolean;
}

export interface ProcessedProductData {
  price: number;
  variants: {
    title: string;
    values: {
      name: string;
      price: string;
      sku: string;
      inventory: number;
    }[];
  }[] | null;
  category: string;
  name: string;
  description: string;
  visibility: "active" | "inactive";
  images: {
    id: string;
    file: File;
    preview: string;
  }[];
  hasVariants: boolean;
  generatedVariants?: {
    name: string;
    price: string;
    attributes: Record<string, string>;
    sku?: string | undefined;
    inventory?: string | undefined;
  }[] | undefined;
}

export interface DBProduct {
  visibility: Visibility;
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date | null;
  price: string;
  description: string;
  category_id: string;
  has_variants: boolean;
  category: Category;
  images: ProductImage[];
  variants: {
    id: string;
    product_id: string;
    title: string;
    generatedVariants: GeneratedVariants[];
  }[];
}