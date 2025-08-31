import { isValidPhoneNumber } from "react-phone-number-input";
import * as z from 'zod'
export const customerFormSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => val.trim().split(/\s+/).length >= 2, {
      message: "Please enter at least first and last name",
    }),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Please enter a valid phone number",
    }),
  avatar: z.union(
    [
      z.string().url("Please provide a valid image URL"),
      z.instanceof(File, { message: "Please upload a valid image file" }),
      z.null(),
    ],
    { required_error: "Avatar is required" }
  ),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  total_orders: number;
  created_at: string;
  updated_at: string | null;
}