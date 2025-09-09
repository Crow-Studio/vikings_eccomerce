"use server"

import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { extractPublicId } from "@/lib/server/utils";
import { v2 as cloudinary } from "cloudinary";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
})

export async function createUserAction(): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can create users", message: null }

    try {
        if (clientIP !== null) ipBucket.consume(clientIP, 1)

        return { message: "User created successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to create user", message: null }
    }
}

export async function deleteUserAction(userIds: string[]): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) return { errorMessage: "Too many requests!", message: null }
    const clientIP = (await headers()).get("X-Forwarded-For")
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) return { errorMessage: "Too many requests!", message: null }
    const { user } = await getCurrentSession()
    if (user?.role !== UserRole.ADMIN) return { errorMessage: "Only admins can delete users", message: null }

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