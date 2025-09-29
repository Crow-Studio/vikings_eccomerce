import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
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

        const { categoriesIds } = await request.json() as { categoriesIds: string[] };

        if (!categoriesIds || !Array.isArray(categoriesIds) || categoriesIds.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or empty categories list' },
                { status: 400 }
            );
        }

        const { user } = await getCurrentSession();
        if (user?.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Only admins can delete categories' },
                { status: 403 }
            );
        }

        const productsWithCategories = await db
            .select({ categoryId: tables.product.category_id })
            .from(tables.product)
            .where(inArray(tables.product.category_id, categoriesIds));

        if (productsWithCategories.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete categories that have associated products. Please remove or reassign the products first.' },
                { status: 409 }
            );
        }

        await db
            .delete(tables.category)
            .where(inArray(tables.category.id, categoriesIds));

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return NextResponse.json(
            {
                message: `${categoriesIds.length} ${categoriesIds.length === 1 ? 'category' : 'categories'} deleted successfully`
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting categories:", error);

        if (error instanceof Error && 'code' in error && error.code === '23503') {
            return NextResponse.json(
                { error: 'Cannot delete categories that have associated products. Please remove or reassign the products first.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete categories" },
            { status: 500 }
        );
    }
}