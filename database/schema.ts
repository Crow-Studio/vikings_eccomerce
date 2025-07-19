import { type InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  jsonb
} from "drizzle-orm/pg-core";
import { customAlphabet } from 'nanoid';

export const generateNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-', 12);

export function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]];
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum Visibility {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const userRoleEnum = pgEnum('user_role', enumToPgEnum(UserRole));
export const visibilityEnum = pgEnum("visibility", enumToPgEnum(Visibility));

export const user = pgTable(
  "user",
  {
    id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull(),
    avatar: text("avatar").notNull(),
    role: userRoleEnum("role").default(UserRole.CUSTOMER).notNull(),
    password: text("password"),
    email_verified: boolean("email_verified").notNull().default(false),
    created_at: timestamp('created_at', { mode: 'date', precision: 3 })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', {
      mode: 'date',
      precision: 3,
    }).$onUpdate(() => new Date())
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  })
);

export const category = pgTable('category', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  name: varchar('name', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
})

export const product = pgTable('products', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  name: varchar('name', { length: 60 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  visibility: visibilityEnum('visibility').default(Visibility.ACTIVE).notNull(),
  category_id: text("category_id")
    .notNull()
    .references(() => category.id),
  has_variants: boolean('has_variants').default(false).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date())
})

export const image = pgTable('images', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id")
    .notNull()
    .references(() => product.id),
  url: text('url').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date())
})

export const variants = pgTable('variants', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id")
    .notNull()
    .references(() => product.id),
  title: varchar('title', { length: 50 }).notNull(),
  values: jsonb('values').notNull(),
})

export const oauth_account = pgTable("oauth_account", {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  provider_user_id: text("provider_user_id").notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date())
});

export const email_verification_request_table = pgTable(
  "email_verification_request",
  {
    id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
    email: text("email").notNull(),
    code: text("code").notNull(),
    user_id: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', precision: 3 })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', {
      mode: 'date',
      precision: 3,
    }).$onUpdate(() => new Date())
  }
);

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', {
    mode: 'date',
    precision: 3,
  }).$onUpdate(() => new Date())
});

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
