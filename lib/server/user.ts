import { db, eq, tables } from "@/database";
import { UserRole } from "@/database/schema";
export async function createUser(
  email: string,
  username: string,
  avatar: string,
  role: UserRole,
  email_verified: boolean,
  passwordHash?: string
): Promise<User> {
  const password = passwordHash ? passwordHash : "";
  const [row] = await db
    .insert(tables.user)
    .values({
      email,
      username,
      avatar,
      role,
      email_verified,
      password,
    })
    .returning();
  if (row === null) {
    throw new Error("Failed to create new user!");
  }
  const user: User = {
    id: row.id,
    avatar: row.avatar,
    email: row.email,
    role: row.role,
    username: row.username,
    email_verified: row.email_verified,
  };
  return user;
}
export async function getUserPasswordHash(user_id: string): Promise<string> {
  const user = await db.query.user.findFirst({
    where: (table) => eq(table.id, user_id),
  });
  if (!user) {
    throw new Error("Invalid user ID");
  }
  return user.password!;
}
export async function updateUserEmailAndSetEmailAsVerified(
  user_id: string
): Promise<void> {
  await db
    .update(tables.user)
    .set({
      email_verified: true,
      updated_at: new Date(),
    })
    .where(eq(tables.user.id, user_id));
}
export interface User {
  id: string;
  role: UserRole;
  email: string;
  username: string;
  avatar: string;
  email_verified: boolean;
}
