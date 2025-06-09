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
      userId: tables.session.userId,
      expiresAt: tables.session.expiresAt,
      userTableId: tables.user.id,
      email: tables.user.email,
      username: tables.user.username,
      avatar: tables.user.avatar,
      role: tables.user.role,
    })
    .from(tables.session)
    .innerJoin(tables.user, eq(tables.session.userId, tables.user.id))
    .where(eq(tables.session.id, sessionId));

  // Check if no session found
  if (!result || result.length === 0) {
    return { session: null, user: null };
  }

  const row = result[0];

  const session: Session = {
    id: row.sessionId,
    userId: row.userId,
    expiresAt: new Date(Number(row.expiresAt) * 1000),
  };

  const user: User = {
    id: row.userId,
    email: row.email,
    username: row.username,
    avatar: row.avatar,
    role: row.role,
  };

  // Check if session is expired
  const now = Date.now();

  if (now >= session.expiresAt.getTime()) {
    // Delete expired session
    await db
      .delete(tables.session)
      .where(
        and(
          eq(tables.session.id, row.sessionId),
          eq(tables.session.userId, row.userId)
        )
      );
    return { session: null, user: null };
  }

  // Check if session needs to be extended (within 15 days of expiry)
  const fifteenDaysInMs = 1000 * 60 * 60 * 24 * 15;
  const thirtyDaysInMs = 1000 * 60 * 60 * 24 * 30;

  if (now >= session.expiresAt.getTime() - fifteenDaysInMs) {
    const newExpiresAt = new Date(now + thirtyDaysInMs);

    await db
      .update(tables.session)
      .set({
        expiresAt: newExpiresAt,
      })
      .where(eq(tables.session.id, row.sessionId));

    // Update the session object with new expiry time
    session.expiresAt = newExpiresAt;
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

export async function invalidateUserSessions(userId: string): Promise<void> {
  await db.delete(tables.session).where(eq(tables.session.userId, userId));
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
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
  userId: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  await db.insert(tables.session).values({
    id: sessionId,
    expiresAt: session.expiresAt,
    userId,
  });
  return session;
}

export interface Session {
  id: string;
  expiresAt: Date;
  userId: string;
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
