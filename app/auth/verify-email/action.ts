"use server";

import { db, eq } from "@/database";
import { deleteUserEmailVerificationRequest } from "@/lib/server/email";
import { ExpiringTokenBucket } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { updateUserEmailAndSetEmailAsVerified } from "@/lib/server/user";
import { ActionResult } from "@/types";

const bucket = new ExpiringTokenBucket<string>(5, 60 * 30);

export async function verifyEmailAction({
  code,
}: {
  code: string;
}): Promise<ActionResult> {
  try {
    if (!(await globalPOSTRateLimit())) {
      return {
        errorMessage: "Too many requests",
        message: null,
      };
    }

    const { session, user } = await getCurrentSession();
    if (session === null) {
      return {
        errorMessage: "Not authenticated",
        message: null,
      };
    }

    if (!bucket.check(user.id, 1)) {
      return {
        errorMessage: "Too many requests",
        message: null,
      };
    }

    const verificationRequest =
      await db.query.email_verification_request_table.findFirst({
        where: (table) => eq(table.userId, user.id),
      });

    if (!verificationRequest) {
      return {
        errorMessage: "Not authenticated!",
        message: null,
      };
    }

    if (typeof code !== "string") {
      return {
        errorMessage: "Invalid or missing fields",
        message: null,
      };
    }

    if (code === "") {
      return {
        errorMessage: "Verification code is required!",
        message: null,
      };
    }

    if (!bucket.consume(user.id, 1)) {
      return {
        errorMessage: "Too many requests",
        message: null,
      };
    }

    if (Date.now() >= verificationRequest.expiresAt.getTime()) {
      return {
        errorMessage: "Verification code has expired!",
        message: null,
      };
    }

    if (verificationRequest.code !== code) {
      return {
        errorMessage: "Incorrect verification code!",
        message: null,
      };
    }

    await deleteUserEmailVerificationRequest(user.id);
    await updateUserEmailAndSetEmailAsVerified(user.id);

    return {
      errorMessage: null,
      message: "You've successfully verified your email!",
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      message: null,
    };
  }
}

// export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {}
