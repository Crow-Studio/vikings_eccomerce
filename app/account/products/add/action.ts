"use server"

import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { ActionResult } from "@/types";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function createNewCategoryAction(category: string): Promise<ActionResult> {
    if (!(await globalPOSTRateLimit())) {
        return {
            errorMessage: "Too many requests!",
            message: null,
        };
    }

    const clientIP = (await headers()).get("X-Forwarded-For");
    if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
        return {
            errorMessage: "Too many requests!",
            message: null,
        };
    }

    if (!category || category.trim() === "") {
        return {
            errorMessage: "Category name cannot be empty",
            message: null,
        };
    }

    const { user } = await getCurrentSession();

    if (user?.role !== UserRole.ADMIN) {
        return {
            errorMessage: "Only admins can create categories",
            message: null,
        };
    }

    try {
        await db.insert(tables.category).values({
            name: category.trim(),
        });

        // Consume token after successful operation
        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return {
            message: 'Category added successfully',
            errorMessage: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                errorMessage: error.message,
                message: null,
            }
        }

        return {
            errorMessage: "Failed to create category",
            message: null,
        };
    }
}