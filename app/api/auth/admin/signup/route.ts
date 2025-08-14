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
            return NextResponse.json(null, { status: 429, statusText: 'Too many requests. Please wait a moment and try again!' });
        }

        const clientIP = (await headers()).get("X-Forwarded-For");
        if (clientIP !== null && !ipBucket.check(clientIP, 1)) {
            return NextResponse.json(null, { status: 429, statusText: 'Too many requests from your location. Please wait a few minutes before trying again!' });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json(null, { status: 400, statusText: 'Please provide both email and password!' });
        }

        if (email === "" || password === "") {
            return NextResponse.json(null, { status: 400, statusText: 'Email and password are required fields!' });
        }

        if (!verifyEmailInput(email)) {
            return NextResponse.json(null, { status: 400, statusText: 'Please enter a valid email address!' });
        }

        const emailAvailable = await checkEmailAvailability(email);

        if (emailAvailable) {
            return NextResponse.json(null, { status: 400, statusText: 'This email address is already registered. Please use a different email or try logging in!' });
        }

        const strongPassword = await verifyPasswordStrength(password);
        if (!strongPassword) {
            return NextResponse.json(null, { status: 400, statusText: 'Password is too weak. Please use a stronger password with at least 8 characters, including uppercase, lowercase, and numbers!' });
        }

        if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
            return NextResponse.json(null, { status: 429, statusText: 'Too many registration attempts. Please wait a few minutes before trying again!' });
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
        return NextResponse.json(null, { status: 500, statusText: 'Something went wrong while creating your account. Please try again' });
    }
}