import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";
import { and, db, eq, tables } from "@/database";
import { User } from "./user";
export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({
      sessionId: tables.session.id,
      user_id: tables.session.user_id,
      expires_at: tables.session.expires_at,
      userTableId: tables.user.id,
      email: tables.user.email,
      username: tables.user.username,
      avatar: tables.user.avatar,
      role: tables.user.role,
      email_verified: tables.user.email_verified,
    })
    .from(tables.session)
    .innerJoin(tables.user, eq(tables.session.user_id, tables.user.id))
    .where(eq(tables.session.id, sessionId));
  if (!result || result.length === 0) {
    return { session: null, user: null };
  }
  const row = result[0];
  const session: Session = {
    id: row.sessionId,
    user_id: row.user_id,
    expires_at: new Date(Number(row.expires_at) * 1000),
  };
  const user: User = {
    id: row.user_id,
    email: row.email,
    username: row.username,
    avatar: row.avatar,
    role: row.role,
    email_verified: row.email_verified,
  };
  const now = Date.now();
  if (now >= session.expires_at.getTime()) {
    await db
      .delete(tables.session)
      .where(
        and(
          eq(tables.session.id, row.sessionId),
          eq(tables.session.user_id, row.user_id)
        )
      );
    return { session: null, user: null };
  }
  const fifteenDaysInMs = 1000 * 60 * 60 * 24 * 15;
  const thirtyDaysInMs = 1000 * 60 * 60 * 24 * 30;
  if (now >= session.expires_at.getTime() - fifteenDaysInMs) {
    const newExpiresAt = new Date(now + thirtyDaysInMs);
    await db
      .update(tables.session)
      .set({
        expires_at: newExpiresAt,
      })
      .where(eq(tables.session.id, row.sessionId));
    session.expires_at = newExpiresAt;
  }
  return { session, user };
}
export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  }
);
export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(tables.session).where(eq(tables.session.id, sessionId));
}
export async function invalidateUserSessions(user_id: string): Promise<void> {
  await db.delete(tables.session).where(eq(tables.session.user_id, user_id));
}
export async function setSessionTokenCookie(
  token: string,
  expires_at: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expires_at,
  });
}
export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}
export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32(tokenBytes).toLowerCase();
  return token;
}
export async function createSession(
  token: string,
  user_id: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user_id,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(tables.session).values({
    id: sessionId,
    expires_at: session.expires_at,
    user_id,
  });
  return session;
}
export interface Session {
  id: string;
  expires_at: Date;
  user_id: string;
}
type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
