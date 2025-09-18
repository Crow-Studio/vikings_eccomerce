"use server"

import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { extractPublicId } from "@/lib/server/utils";
import { CreateUserFormValues, EditUserFormValues } from "@/types/users";
import { checkEmailAvailability, verifyEmailInput } from "@/lib/server/email";
import { createUser } from "@/lib/server/user";
import { capitalize } from "@/lib/server/username";
import { hashPassword } from "@/lib/server/password";
import { cloudinary } from "@/lib/server/cloudinary";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function createUserAction(data: CreateUserFormValues): Promise<ActionResult> {
    const { email, password, first_name, last_name, role } = data
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can create users", message: null }

    if (typeof email !== "string" || email === "") {
        return {
            errorMessage: "Email is required!", message: null
        }
    }

    if (typeof password !== "string" || password === "") {
        return {
            errorMessage: "Password is required!", message: null
        }
    }

    if (typeof first_name !== "string" || first_name === "") {
        return {
            errorMessage: "First name is required!", message: null
        }
    }

    if (typeof last_name !== "string" || last_name === "") {
        return {
            errorMessage: "Last name is required!", message: null
        }
    }

    if (!role || !Object.values(UserRole).includes(role)) {
        return {
            errorMessage: "Valid role is required!", message: null
        }
    }

    // Avatar validation
    if (data.avatar !== null) {
        if (data.avatar instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(data.avatar.type)) {
                return {
                    errorMessage: "Avatar must be a valid image file (JPEG, PNG, or WebP)", message: null
                }
            }

            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (data.avatar.size > maxSize) {
                return {
                    errorMessage: "Avatar file size must be less than 5MB", message: null
                }
            }
        } else if (typeof data.avatar === "string") {
            try {
                new URL(data.avatar);
            } catch {
                return {
                    errorMessage: "Avatar URL is not valid", message: null
                }
            }
        } else {
            return {
                errorMessage: "Avatar must be a file or valid URL", message: null
            }
        }
    }

    if (!verifyEmailInput(email)) {
        return {
            errorMessage: "Please enter a valid email address!", message: null
        }
    }

    const emailAvailable = await checkEmailAvailability(email);
    if (emailAvailable) {
        return {
            errorMessage: "This email address is already registered to a user. Please use a different email!'", message: null
        }
    }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        let avatarUrl: string | null = null;
        if (data.avatar instanceof File) {
            avatarUrl = await uploadFileToCloudinary(data.avatar);
        } else if (typeof data.avatar === "string") {
            avatarUrl = data.avatar;
        }

        const username = `${capitalize(first_name)} ${capitalize(last_name)}`
        const passwordHash = await hashPassword(password);
        const email_verified = false;
        const avatar = avatarUrl as string

        await createUser(
            email,
            username,
            avatar,
            role,
            email_verified,
            passwordHash
        );

        return { message: "User created successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to create user", message: null }
    }
}

export async function editUserAction(data: EditUserFormValues): Promise<ActionResult> {
    const { email, first_name, last_name, role } = data
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can edit users", message: null }

    if (typeof email !== "string" || email === "") {
        return {
            errorMessage: "Email is required!", message: null
        }
    }

    if (typeof first_name !== "string" || first_name === "") {
        return {
            errorMessage: "First name is required!", message: null
        }
    }

    if (typeof last_name !== "string" || last_name === "") {
        return {
            errorMessage: "Last name is required!", message: null
        }
    }

    if (!role || !Object.values(UserRole).includes(role)) {
        return {
            errorMessage: "Valid role is required!", message: null
        }
    }

    // Avatar validation
    if (data.avatar !== null) {
        if (data.avatar instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(data.avatar.type)) {
                return {
                    errorMessage: "Avatar must be a valid image file (JPEG, PNG, or WebP)", message: null
                }
            }

            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (data.avatar.size > maxSize) {
                return {
                    errorMessage: "Avatar file size must be less than 5MB", message: null
                }
            }
        } else if (typeof data.avatar === "string") {
            try {
                new URL(data.avatar);
            } catch {
                return {
                    errorMessage: "Avatar URL is not valid", message: null
                }
            }
        } else {
            return {
                errorMessage: "Avatar must be a file or valid URL", message: null
            }
        }
    }

    if (!verifyEmailInput(email)) {
        return {
            errorMessage: "Please enter a valid email address!", message: null
        }
    }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        let avatarUrl: string | null = null;
        if (data.avatar instanceof File) {
            avatarUrl = await uploadFileToCloudinary(data.avatar);
        } else if (typeof data.avatar === "string") {
            avatarUrl = data.avatar;
        }

        const username = `${capitalize(first_name)} ${capitalize(last_name)}`
        const avatar = avatarUrl as string

        await db.update(tables.user).set({
            email,
            username,
            avatar,
            role
        }).where(eq(tables.user.id, user.id))

        return { message: "User info updated successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to edit user info", message: null }
    }
}

export async function deleteUserAction(userIds: string[]): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can delete users", message: null }

    if (user && userIds.includes(user.id)) {
        return {
            errorMessage: "You cannot delete your own account",
            message: null
        }
    }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        const imagesToDelete = await db
            .select({ avatar: tables.user.avatar })
            .from(tables.user)
            .where(inArray(tables.user.id, userIds))

        await db.transaction(async tx => {
            await tx.delete(tables.user).where(inArray(tables.user.id, userIds))
        })

        if (imagesToDelete.length > 0) {
            await Promise.all(
                imagesToDelete.map(async (img: { avatar: string; }) => {
                    const publicId = extractPublicId(img.avatar)
                    if (!publicId) return Promise.resolve()
                    try {
                        return await cloudinary.uploader.destroy(publicId);
                    } catch {
                        return null;
                    }
                })
            )
        }

        return {
            message: `${userIds.length > 1 ? "Users" : "User"} deleted successfully`,
            errorMessage: null
        }

    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to delete user", message: null }
    }
}

async function uploadFileToCloudinary(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error || !result) {
                    return reject(new Error(error?.message || "Avatar upload failed"));
                }
                resolve(result.secure_url);
            }
        );
        file
            .arrayBuffer()
            .then((buf: ArrayBuffer) => {
                stream.end(Buffer.from(buf));
            })
            .catch(reject);
    });
}