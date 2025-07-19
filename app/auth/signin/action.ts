"use server";

import { db, eq } from "@/database";
import { verifyEmailInput } from "@/lib/server/email";
import { verifyPasswordHash } from "@/lib/server/password";
import { RefillingTokenBucket, Throttler } from "@/lib/server/rate-limit";
import { globalPOSTRateLimit } from "@/lib/server/request";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { getUserPasswordHash } from "@/lib/server/user";
import { ActionResult } from "@/types";
import { headers } from "next/headers";

const ipBucket = new RefillingTokenBucket<string>(3, 10);
const throttler = new Throttler<string>([1, 2, 4, 8, 16, 30, 60, 180, 300]);

export async function signinAction({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult> {
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

  const user = await db.query.user.findFirst({
    where: (table) => eq(table.email, email),
  });

  if (!user) {
    return {
      errorMessage: "Account does not exist!",
      message: null,
    };
  }

  if (clientIP !== null && !ipBucket.consume(clientIP, 1)) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }

  if (!throttler.consume(user.id)) {
    return {
      errorMessage: "Too many requests!",
      message: null,
    };
  }

  if (!user.password) {
    return {
      errorMessage:
        "Account exists but password wasn't set. Signin with Google and set you password in the settings!",
      message: null,
    };
  }

  const passwordHash = await getUserPasswordHash(user.id);
  const validPassword = await verifyPasswordHash(passwordHash, password);
  if (!validPassword) {
    return {
      errorMessage: "Invalid password!",
      message: null,
    };
  }
  throttler.reset(user.id);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expires_at);

  return {
    errorMessage: null,
    message: "You've successfully signed in!",
  };
}
