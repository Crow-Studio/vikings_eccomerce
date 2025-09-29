import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

        const { category } = await request.json();

        if (!category || category.trim() === "") {
            return NextResponse.json(
                { error: 'Category name cannot be empty' },
                { status: 400 }
            );
        }

        const { user } = await getCurrentSession();
        if (user?.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: 'Only admins can create categories' },
                { status: 403 }
            );
        }

        await db.insert(tables.category).values({
            name: category.trim(),
        });

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return NextResponse.json(
            { message: 'Category added successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating category:", error);

        if (error.cause.code === '23505' && error.cause.constraint_name === 'category_name_unique') {
            return NextResponse.json(
                { error: 'A category with this name already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create category' },
            { status: 500 }
        );
    }
}