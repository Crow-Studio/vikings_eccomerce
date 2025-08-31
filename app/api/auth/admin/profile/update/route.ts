import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/session";
import { db, eq, tables } from "@/database";
const ipBucket = new RefillingTokenBucket<string>(3, 10);
export async function PATCH(request: NextRequest) {
    try {
        const { image, username } = await request.json() as { image: string, username: string }
        const { user } = await getCurrentSession();
        if (!(await globalPOSTRateLimit())) {
            return NextResponse.json(null, { status: 429, statusText: 'Too many requests. Please wait a moment and try again.' });
        }
        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return NextResponse.json(null, { status: 429, statusText: 'Too many requests from your location. Please wait a few minutes before trying again.' });
        }
        if (!user) {
            return NextResponse.json(null, { status: 401, statusText: 'Unauthorized!' });
        }
        if (typeof image !== "string" && !image) {
            return NextResponse.json(null, { status: 400, statusText: 'Image is required!' });
        }
        if (typeof username !== "string" && !username) {
            return NextResponse.json(null, { status: 400, statusText: 'Username is required!' });
        }
        const existingUser = await db.query.user.findFirst({
            where: table => eq(table.id, user.id)
        })
        if (!existingUser) {
            return NextResponse.json(null, { status: 400, statusText: 'Invalid user!' });
        }
        await db.update(tables.user).set({
            username,
            avatar: image
        })
        return NextResponse.json({
            message: "You've successfully update your profile info"
        }, {
            statusText: "You've successfully update your profile info"
        })
    } catch {
        return NextResponse.json(null, { status: 500, statusText: 'Something went wrong while updating profile. Please try again' });
    }
}