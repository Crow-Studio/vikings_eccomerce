import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ categoryId: string }> }) {
    const ipBucket = new RefillingTokenBucket<string>(3, 10);

    try {
        if (!(await globalPOSTRateLimit())) {
            return NextResponse.json(
                { error: 'Too many requests!' },
                { status: 429 }
            );
        }

        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return NextResponse.json(
                { error: 'Too many requests!' },
                { status: 429 }
            );
        }

        const { name } = await request.json() as { name: string };
        const { categoryId } = await params;

        if (!categoryId || typeof categoryId !== 'string') {
            return NextResponse.json(
                { error: 'Category id cannot be empty' },
                { status: 400 }
            );
        }

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { error: 'Category name cannot be empty' },
                { status: 400 }
            );
        }

        const { user } = await getCurrentSession();
        if (user?.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Only admins can edit categories' },
                { status: 403 }
            );
        }

        // Check if category exists
        const existingCategory = await db
            .select()
            .from(tables.category)
            .where(eq(tables.category.id, categoryId))
            .limit(1);

        if (existingCategory.length === 0) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        await db
            .update(tables.category)
            .set({
                name: name.trim(),
            })
            .where(
                eq(tables.category.id, categoryId)
            );

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return NextResponse.json(
            { message: 'Category updated successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating category:", error);

        if (error.cause?.code === '23505' && error.cause.constraint_name === 'category_name_unique') {
            return NextResponse.json(
                { error: 'A category with this name already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update category" },
            { status: 500 }
        );
    }
}