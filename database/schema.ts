import { type InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "CUSTOMER"]);

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull(),
    avatar: text("avatar").notNull(),
    role: userRoleEnum("role").default("CUSTOMER").notNull(),
    password: text("password"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  })
);

export const oauth_account = pgTable("oauth_account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", precision: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
  }).$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
