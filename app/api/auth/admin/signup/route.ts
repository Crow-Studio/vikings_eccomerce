import { UserRole } from "@/database/schema";
import { checkEmailAvailability, createEmailVerificationRequest, sendVerificationCodeRequest, verifyEmailInput } from "@/lib/server/email";
import { hashPassword, verifyPasswordStrength } from "@/lib/server/password";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { createUser } from "@/lib/server/user";
import { generateRandomUsername } from "@/lib/server/username";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!(await globalPOSTRateLimit())) {
            return NextResponse.json({
                error: "Too many requests. Please wait a moment and try again."
            }, { status: 429 });
        }

        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return NextResponse.json({
                error: "Too many requests from your location. Please wait a few minutes before trying again."
            }, { status: 429 });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json({
                error: "Please provide both email and password."
            }, { status: 400 });
        }

        if (email === "" || password === "") {
            return NextResponse.json({
                error: "Email and password are required fields."
            }, { status: 400 });
        }

        if (!verifyEmailInput(email)) {
            return NextResponse.json({
                error: "Please enter a valid email address."
            }, { status: 400 });
        }

        const emailAvailable = await checkEmailAvailability(email);

        console.log('emailAvailable', emailAvailable)
        if (emailAvailable) {
            return NextResponse.json({
                error: "This email address is already registered. Please use a different email or try logging in."
            }, { status: 400 });
        }

        const strongPassword = await verifyPasswordStrength(password);
        if (!strongPassword) {
            return NextResponse.json({
                error: "Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, and numbers."
            }, { status: 400 });
        }

        if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
            return NextResponse.json({
                error: "Too many registration attempts. Please wait a few minutes before trying again."
            }, { status: 429 });
        }

        const username = generateRandomUsername();
        const avatar = `https://avatar.vercel.sh/vercel.svg?text=${username
            .split(" ")[0]
            .charAt(0)
            .toUpperCase()}`;
        const role: UserRole = UserRole.ADMIN;
        const email_verified = false;
        const passwordHash = await hashPassword(password);

        const user = await createUser(
            email,
            username,
            avatar,
            role,
            email_verified,
            passwordHash
        );

        const emailVerificationRequest = await createEmailVerificationRequest(
            user.id,
            user.email
        );

        await sendVerificationCodeRequest({
            code: emailVerificationRequest.code,
            email: emailVerificationRequest.email,
        });

        return NextResponse.json({
            message: "Account created successfully! Please check your email for a verification link."
        });
    } catch {
        return NextResponse.json({
            error: "Something went wrong while creating your account. Please try again."
        }, { status: 500 });
    }
}