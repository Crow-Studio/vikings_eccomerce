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

import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { db, eq, tables } from "@/database";
import { UserRole } from "@/database/schema";

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
    where: (table) => eq(table.provider_user_id, googleId),
  });

  if (existingOauthAccount) {
    const sessionToken = generateSessionToken();
    const session = await createSession(
      sessionToken,
      existingOauthAccount.user_id
    );
    await setSessionTokenCookie(sessionToken, session.expires_at);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/account/dashboard",
      },
    });
  }

  const role: UserRole = UserRole.CUSTOMER;
  const email_verified = true;

  // create new user
  const user = await createUser(
    email,
    username,
    avatar,
    role,
    email_verified
  );

  // create user oauth account
  await db.insert(tables.oauth_account).values({
    provider: "google",
    provider_user_id: googleId,
    user_id: user.id
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expires_at);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/account/dashboard",
    },
  });
}
