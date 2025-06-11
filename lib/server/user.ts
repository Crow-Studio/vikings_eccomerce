import { db, eq, tables } from "@/database";

export async function createUser(
  id: string,
  email: string,
  username: string,
  avatar: string,
  role: "ADMIN" | "CUSTOMER",
  emailVerified: boolean,
  passwordHash?: string
): Promise<User> {
  const password = passwordHash ? passwordHash : "";
  const [row] = await db
    .insert(tables.user)
    .values({
      id,
      email,
      username,
      avatar,
      role,
      emailVerified,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    emailVerified: row.emailVerified,
  };

  return user;
}

export async function getUserPasswordHash(userId: string): Promise<string> {
  const user = await db.query.user.findFirst({
    where: (table) => eq(table.id, userId),
  });

  if (!user) {
    throw new Error("Invalid user ID");
  }
  return user.password!;
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: string
): Promise<void> {
  await db
    .update(tables.user)
    .set({
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(tables.user.id, userId));
}

export interface User {
  id: string;
  role: "ADMIN" | "CUSTOMER";
  email: string;
  username: string;
  avatar: string;
  emailVerified: boolean;
}
