import { UserRole } from '@/database/schema';
import * as z from 'zod'

export const createUserFormSchema = z.object({
    first_name: z
        .string()
        .min(1, "Full name is required"),
    last_name: z
        .string()
        .min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    avatar: z.union(
        [
            z.string().url("Please provide a valid image URL"),
            z.instanceof(File, { message: "Please upload a valid image file" }),
            z.null(),
        ],
        { required_error: "Avatar is required" }
    ),
    role: z.nativeEnum(UserRole),
    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .max(128, {
            message: "Password is too long (max 128 characters)",
        })
        // At least one lowercase letter
        .refine((password) => /[a-z]/.test(password), {
            message: "Password must contain at least one lowercase letter",
        })
        // At least one uppercase letter
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter",
        })
        // At least one digit
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number",
        })
        // At least one special character
        .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
            message:
                'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)',
        })
        // No common weak patterns
        .refine(
            (password) => {
                const weakPatterns = [
                    /^(.)\1+$/, // All same character
                    /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
                    /^(password|123456|qwerty|admin|letmein)/i, // Common passwords
                ];
                return !weakPatterns.some((pattern) => pattern.test(password));
            },
            { message: "Password is too weak - avoid common patterns and sequences" },
        )
        // No whitespace at start or end
        .refine((password) => password === password.trim(), {
            message: "Password cannot start or end with whitespace",
        }),
});

export const editUserFormSchema = z.object({
    first_name: z
        .string()
        .min(1, "Full name is required"),
    last_name: z
        .string()
        .min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    avatar: z.union(
        [
            z.string().url("Please provide a valid image URL"),
            z.instanceof(File, { message: "Please upload a valid image file" }),
            z.null(),
        ],
        { required_error: "Avatar is required" }
    ),
    role: z.nativeEnum(UserRole),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type EditUserFormValues = z.infer<typeof editUserFormSchema>;