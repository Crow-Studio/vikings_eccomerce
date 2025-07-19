import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { addProductFormSchema } from "./products/form";

export type ModalType = "signoutUser";

export interface ModalData {}

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
  variants?:
    | {
        values: string[];
        title: string;
      }[]
    | undefined;
  generatedVariants?:
    | {
        name: string;
        attributes: Record<string, string>;
        price?: string | undefined;
        sku?: string | undefined;
        inventory?: string | undefined;
      }[]
    | undefined;
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
}

export interface GeneralInformationProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
}
export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

export interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ProductSettingsProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
}

export interface ProductImagesProps {
  form: UseFormReturn<z.infer<typeof addProductFormSchema>>;
}