import { type InferSelectModel, relations } from "drizzle-orm"
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  integer
} from "drizzle-orm/pg-core"
import { customAlphabet } from 'nanoid'

export const generateNanoId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-', 12)

export function enumToPgEnum<T extends Record<string, string>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]]
}

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum Visibility {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export const userRoleEnum = pgEnum('user_role', enumToPgEnum(UserRole))
export const visibilityEnum = pgEnum("visibility", enumToPgEnum(Visibility))

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
    created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  })
)

export const category = pgTable('category', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  name: varchar('name', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

export const product = pgTable('products', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  name: varchar('name', { length: 60 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  visibility: visibilityEnum('visibility').default(Visibility.ACTIVE).notNull(),
  category_id: text("category_id").notNull().references(() => category.id),
  has_variants: boolean('has_variants').default(false).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

export const images = pgTable('images', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
  url: text('url').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

export const variants = pgTable('variants', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
  title: varchar('title', { length: 50 }).notNull(),
})

export const generatedVariants = pgTable('generated_variants', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  variant_id: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  name: varchar('name', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  sku: varchar('sku', { length: 50 }).notNull(),
  inventory: integer('inventory').default(0).notNull(),
})

export const oauth_account = pgTable("oauth_account", {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  provider_user_id: text("provider_user_id").notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

export const email_verification_request_table = pgTable(
  "email_verification_request",
  {
    id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
    email: text("email").notNull(),
    code: text("code").notNull(),
    user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
  }
)

export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  oauth_accounts: many(oauth_account),
  email_verification_requests: many(email_verification_request_table),
  sessions: many(session),
}))

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}))

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, { fields: [product.category_id], references: [category.id] }),
  images: many(images),
  variants: many(variants),
}))

export const imageRelations = relations(images, ({ one }) => ({
  product: one(product, { fields: [images.product_id], references: [product.id] }),
}))

export const variantRelations = relations(variants, ({ one, many }) => ({
  product: one(product, { fields: [variants.product_id], references: [product.id] }),
  generatedVariants: many(generatedVariants),
}))

export const generatedVariantRelations = relations(generatedVariants, ({ one }) => ({
  variant: one(variants, { fields: [generatedVariants.variant_id], references: [variants.id] }),
}))

export const oauthAccountRelations = relations(oauth_account, ({ one }) => ({
  user: one(user, { fields: [oauth_account.user_id], references: [user.id] }),
}))

export const emailVerificationRequestRelations = relations(email_verification_request_table, ({ one }) => ({
  user: one(user, { fields: [email_verification_request_table.user_id], references: [user.id] }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.user_id], references: [user.id] }),
}))

export type User = InferSelectModel<typeof user>
export type Session = InferSelectModel<typeof session>
export type Category = InferSelectModel<typeof category>
export type GeneratedVariants = InferSelectModel<typeof generatedVariants>
export type ProductImage = InferSelectModel<typeof images>
export type Product = InferSelectModel<typeof product>
export type ProductVariant = InferSelectModel<typeof variants>