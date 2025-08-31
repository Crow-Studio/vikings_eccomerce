import { Customer } from "@/database/schema";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncateText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getCustomerAvatar = (customer: Customer) => {
  if (customer.avatar) {
    return customer.avatar;
  }
  const initials = customer.full_name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
  return initials;
};