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

export function enumToPgEnum<T extends Record<string, string>>(myEnum: T): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum) as [T[keyof T], ...T[keyof T][]]
}

// Enums
export enum UserRole {
  ADMIN = 'admin',
}

export enum Visibility {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const userRoleEnum = pgEnum('user_role', enumToPgEnum(UserRole))
export const visibilityEnum = pgEnum("visibility", enumToPgEnum(Visibility))
export const orderStatusEnum = pgEnum("order_status", enumToPgEnum(OrderStatus))

// Users (Admins / Staff)
export const user = pgTable(
  "user",
  {
    id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull(),
    avatar: text("avatar").notNull(),
    role: userRoleEnum("role").default(UserRole.ADMIN).notNull(),
    password: text("password"),
    email_verified: boolean("email_verified").notNull().default(false),
    created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  })
)

// Categories
export const category = pgTable('category', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  name: varchar('name', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
})

// Products
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

// Product Images
export const images = pgTable('images', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
  url: text('url').notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Variants
export const variants = pgTable('variants', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  product_id: text("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
  title: varchar('title', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

export const generatedVariants = pgTable('generated_variants', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  variant_id: text("variant_id").notNull().references(() => variants.id, { onDelete: "cascade" }),
  name: varchar('name', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  sku: varchar('sku', { length: 50 }).notNull(),
  inventory: integer('inventory').default(0).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Customers
export const customer = pgTable('customer', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text("address"),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Orders
export const order = pgTable('order', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  customer_id: text("customer_id").notNull().references(() => customer.id, { onDelete: "cascade" }),
  status: orderStatusEnum('status').default(OrderStatus.PENDING).notNull(),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Order Items
export const orderItem = pgTable('order_item', {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  order_id: text("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
  product_id: text("product_id").notNull().references(() => product.id),
  quantity: integer('quantity').default(1).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// OAuth
export const oauth_account = pgTable("oauth_account", {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  provider_user_id: text("provider_user_id").notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Email Verification
export const email_verification_request_table = pgTable("email_verification_request", {
  id: varchar('id', { length: 12 }).primaryKey().$defaultFn(() => generateNanoId()),
  email: text("email").notNull(),
  code: text("code").notNull(),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

// Sessions
export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  user_id: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  created_at: timestamp('created_at', { mode: 'date', precision: 3 }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date())
})

/* ------------------- RELATIONS ------------------- */
export const customerRelations = relations(customer, ({ many }) => ({
  orders: many(order)
}))

export const orderRelations = relations(order, ({ one, many }) => ({
  customer: one(customer, { fields: [order.customer_id], references: [customer.id] }),
  items: many(orderItem)
}))

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.order_id], references: [order.id] }),
  product: one(product, { fields: [orderItem.product_id], references: [product.id] })
}))

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}))

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, { fields: [product.category_id], references: [category.id] }),
  images: many(images),
  variants: many(variants),
  order_items: many(orderItem)
}))

/* ------------------- TYPES ------------------- */
export type User = InferSelectModel<typeof user>
export type Customer = InferSelectModel<typeof customer>
export type Order = InferSelectModel<typeof order>
export type OrderItem = InferSelectModel<typeof orderItem>
export type Category = InferSelectModel<typeof category>
export type Product = InferSelectModel<typeof product>
