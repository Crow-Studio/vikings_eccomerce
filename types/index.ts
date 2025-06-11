import { z } from "zod";

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
