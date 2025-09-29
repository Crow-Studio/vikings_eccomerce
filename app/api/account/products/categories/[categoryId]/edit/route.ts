import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: Promise<{ categoryId: string }> }) {
    const ipBucket = new RefillingTokenBucket<string>(3, 10);
    const { name } = await request.json() as { name: string };
    const { categoryId } = await params

    try {
        if (!(await globalPOSTRateLimit())) {
            return Response.json(
                null,
                { status: 429, statusText: 'Too many requests!' }
            );
        }

        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return Response.json(
                null,
                { status: 429, statusText: 'Too many requests!' }
            );
        }

        if (!categoryId || typeof categoryId !== 'string') {
            return Response.json(
                null,
                { status: 400, statusText: 'Category id cannot be empty' }
            );
        }

        if (!name || name.trim() === "") {
            return Response.json(
                null,
                { status: 400, statusText: 'Category name cannot be empty' }
            );
        }

        const { user } = await getCurrentSession();
        if (user?.role !== UserRole.ADMIN) {
            return Response.json(
                null,
                { status: 403, statusText: 'Only admins can delete categories' }
            );
        }

        await db
            .update(tables.category)
            .set({
                name,
            })
            .where(
                eq(tables.category.id, categoryId)
            );

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return Response.json(
            { message: `Category updated successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating categories:", error);
        return Response.json(
            null,
            { status: 500, statusText: error instanceof Error ? error.message : "Failed to update category" }
        );
    }
}