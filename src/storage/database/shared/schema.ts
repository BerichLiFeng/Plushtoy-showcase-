import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
  numeric,
} from "drizzle-orm/pg-core";

// System table - do not delete
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow(),
});

// 公司信息（单行配置)
export const companyInfo = pgTable("company_info", {
  id: serial().primaryKey(),
  company_name: varchar("company_name", { length: 255 }).notNull().default(""),
  slogan: varchar("slogan", { length: 500 }).default(""),
  description: text("description").default(""),
  mission: text("mission").default(""),
  history: text("history").default(""),
  logo_key: varchar("logo_key", { length: 500 }).default(""),
  cover_image_key: varchar("cover_image_key", { length: 500 }).default(""),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 业务板块
export const businessServices = pgTable(
  "business_services",
  {
    id: serial().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").default(""),
    icon: varchar("icon", { length: 100 }).default(""),
    image_key: varchar("image_key", { length: 500 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("business_services_sort_idx").on(table.sort_order)],
);

// 产品分类
export const productCategories = pgTable(
  "product_categories",
  {
    id: serial().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description").default(""),
    cover_image_key: varchar("cover_image_key", { length: 500 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("product_categories_sort_idx").on(table.sort_order),
    index("product_categories_slug_idx").on(table.slug),
  ],
);

// 产品
export const products = pgTable(
  "products",
  {
    id: serial().primaryKey(),
    category_id: integer("category_id")
      .notNull()
      .references(() => productCategories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").default(""),
    image_keys: jsonb("image_keys").default([]),
    price: varchar("price", { length: 100 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("products_category_id_idx").on(table.category_id),
    index("products_sort_idx").on(table.sort_order),
  ],
);

// 合作客户
export const clients = pgTable(
  "clients",
  {
    id: serial().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    logo_key: varchar("logo_key", { length: 500 }).default(""),
    description: text("description").default(""),
    website_url: varchar("website_url", { length: 500 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("clients_sort_idx").on(table.sort_order)],
);

// 合作案例
export const cases = pgTable(
  "cases",
  {
    id: serial().primaryKey(),
    client_id: integer("client_id").references(() => clients.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").default(""),
    cover_image_key: varchar("cover_image_key", { length: 500 }).default(""),
    content: text("content").default(""),
    is_published: boolean("is_published").default(false).notNull(),
    sort_order: integer("sort_order").default(0),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cases_client_id_idx").on(table.client_id),
    index("cases_sort_idx").on(table.sort_order),
    index("cases_published_idx").on(table.is_published),
  ],
);

// 工厂资质
export const certifications = pgTable(
  "certifications",
  {
    id: serial().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    image_key: varchar("image_key", { length: 500 }).default(""),
    description: text("description").default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("certifications_sort_idx").on(table.sort_order)],
);

// 展会集锦
export const exhibitions = pgTable(
  "exhibitions",
  {
    id: serial().primaryKey(),
    title: varchar("title", { length: 255 }).default(""),
    image_key: varchar("image_key", { length: 500 }).notNull(),
    description: text("description").default(""),
    exhibition_date: varchar("exhibition_date", { length: 50 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("exhibitions_sort_idx").on(table.sort_order)],
);

// 联系方式
export const contacts = pgTable("contacts", {
  id: serial().primaryKey(),
  address: text("address").default(""),
  phone: varchar("phone", { length: 100 }).default(""),
  email: varchar("email", { length: 255 }).default(""),
  wechat: varchar("wechat", { length: 255 }).default(""),
  working_hours: varchar("working_hours", { length: 255 }).default(""),
  latitude: varchar("latitude", { length: 50 }).default(""),
  longitude: varchar("longitude", { length: 50 }).default(""),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 社交媒体链接
export const socialLinks = pgTable(
  "social_links",
  {
    id: serial().primaryKey(),
    platform_name: varchar("platform_name", { length: 100 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    icon: varchar("icon", { length: 100 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("social_links_sort_idx").on(table.sort_order)],
);

// 首页Banner
export const banners = pgTable(
  "banners",
  {
    id: serial().primaryKey(),
    title: varchar("title", { length: 255 }).default(""),
    subtitle: varchar("subtitle", { length: 500 }).default(""),
    image_key: varchar("image_key", { length: 500 }).notNull(),
    link_url: varchar("link_url", { length: 500 }).default(""),
    sort_order: integer("sort_order").default(0),
    is_active: boolean("is_active").default(true).notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("banners_sort_idx").on(table.sort_order)],
);