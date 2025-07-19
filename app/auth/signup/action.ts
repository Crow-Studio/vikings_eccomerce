"use server";

import { UserRole } from "@/database/schema";
import {
  checkEmailAvailability,
  createEmailVerificationRequest,
  sendVerificationCodeRequest,
  verifyEmailInput,
} from "@/lib/server/email";
import { hashPassword, verifyPasswordStrength } from "@/lib/server/password";
import { RefillingTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { createUser } from "@/lib/server/user";
import { generateRandomUsername } from "@/lib/server/username";
import { ActionResult } from "@/types";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);

export async function signupAction({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
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

    if (typeof email !== "string" || typeof password !== "string") {
      return {
        errorMessage: "Invalid or missing fields!",
        message: null,
      };
    }
    if (email === "" || password === "") {
      return {
        errorMessage: "Please enter your email and password!",
        message: null,
      };
    }

    if (!verifyEmailInput(email)) {
      return {
        errorMessage: "Invalid email!",
        message: null,
      };
    }

    const emailAvailable = await checkEmailAvailability(email);
    if (emailAvailable) {
      return {
        errorMessage: "Email is already used!",
        message: null,
      };
    }

    const strongPassword = await verifyPasswordStrength(password);
    if (!strongPassword) {
      return {
        errorMessage: "Weak password!",
        message: null,
      };
    }

    if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
      return {
        errorMessage: "Too many requests",
        message: null,
      };
    }

    const username = generateRandomUsername();
    const avatar = `https://avatar.vercel.sh/vercel.svg?text=${username
      .split(" ")[0]
      .charAt(0)
      .toUpperCase()}`;
    const role: UserRole = UserRole.CUSTOMER;
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

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expires_at);

    return {
      errorMessage: null,
      message:
        "You've successfully signed up! Check your email for the verification code.",
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      message: null,
    };
  }
}
