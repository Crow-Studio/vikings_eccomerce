import { db, tables } from "@/database";
import { UserRole } from "@/database/schema";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { headers } from "next/headers";

export async function POST(request: Request) {
    const ipBucket = new RefillingTokenBucket<string>(3, 10);

    try {
        if (!(await globalPOSTRateLimit())) {
            return Response.json(
                { errorMessage: "Too many requests!", message: null },
                { status: 429 }
            );
        }

        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return Response.json(
                { errorMessage: "Too many requests!", message: null },
                { status: 429 }
            );
        }

        const { category } = await request.json();

        if (!category || category.trim() === "") {
            return Response.json(
                { errorMessage: "Category name cannot be empty", message: null },
                { status: 400 }
            );
        }

        const { user } = await getCurrentSession();
        if (user?.role !== UserRole.ADMIN) {
            return Response.json(
                { errorMessage: "Only admins can create categories", message: null },
                { status: 403 }
            );
        }

        await db.insert(tables.category).values({
            name: category.trim(),
        });

        if (clientIP !== null) {
            ipBucket.consume(clientIP, 1);
        }

        return Response.json(
            { message: "Category added successfully", errorMessage: null },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating category:", error);
        return Response.json(
            {
                errorMessage: error instanceof Error ? error.message : "Failed to create category",
                message: null,
            },
            { status: 500 }
        );
    }
}