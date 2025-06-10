import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { google } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { createUser } from "@/lib/server/user";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { globalGETRateLimit } from "@/lib/server/request";
import { v4 as uuidv4 } from "uuid";

import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { db, eq, tables } from "@/database";

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString("sub");
  const username = claimsParser.getString("name");
  const avatar = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  // check if user existing oauth account exists
  const existingOauthAccount = await db.query.oauth_account.findFirst({
    where: (table) => eq(table.providerUserId, googleId),
  });

  if (existingOauthAccount) {
    const sessionToken = generateSessionToken();
    const session = await createSession(
      sessionToken,
      existingOauthAccount.userId
    );
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account/dashboard",
      },
    });
  }

  const id = uuidv4();
  const role: "ADMIN" | "CUSTOMER" = "CUSTOMER";
  const emailVerified = true;

  // create new user
  const user = await createUser(
    id,
    email,
    username,
    avatar,
    role,
    emailVerified
  );

  // create user oauth account
  await db.insert(tables.oauth_account).values({
    id: uuidv4(),
    provider: "google",
    providerUserId: googleId,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/account/dashboard",
    },
  });
}
