import { db, tables } from "@/database";

export async function createUser(
  id: string,
  email: string,
  username: string,
  avatar: string,
  role: "ADMIN" | "CUSTOMER"
): Promise<User> {
  const [row] = await db
    .insert(tables.user)
    .values({
      id,
      email,
      username,
      avatar,
      role,
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
  };

  return user;
}

export interface User {
  id: string;
  role: "ADMIN" | "CUSTOMER";
  email: string;
  username: string;
  avatar: string;
}
