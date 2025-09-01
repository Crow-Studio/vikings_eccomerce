"use server"

import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

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
        console.log(userIds)
        return { message: "User deleted successfully", errorMessage: null }
    } catch (error) {
        if (error instanceof Error) return { errorMessage: error.message, message: null }
        return { errorMessage: "Failed to delete user", message: null }
    }
}