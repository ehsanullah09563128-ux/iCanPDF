import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "premium", "business", "enterprise"]);
export const fileStatusEnum = pgEnum("file_status", ["uploading", "ready", "processing", "failed", "deleted"]);
export const jobStatusEnum = pgEnum("job_status", ["queued", "processing", "completed", "failed", "cancelled"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash"),
    avatarUrl: text("avatar_url"),
    googleId: varchar("google_id", { length: 255 }),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    plan: planEnum("plan").default("free").notNull(),
    storageUsed: bigint("storage_used", { mode: "number" }).default(0).notNull(),
    storageLimit: bigint("storage_limit", { mode: "number" }).default(524_288_000).notNull(),
    locale: varchar("locale", { length: 12 }).default("en").notNull(),
    theme: varchar("theme", { length: 12 }).default("system").notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 64 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("sessions_user_idx").on(table.userId), uniqueIndex("sessions_token_idx").on(table.tokenHash)],
);

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    parentId: uuid("parent_id"),
    name: varchar("name", { length: 160 }).notNull(),
    color: varchar("color", { length: 20 }).default("blue").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("folders_user_idx").on(table.userId)],
);

export const files = pgTable(
  "files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    folderId: uuid("folder_id").references(() => folders.id, { onDelete: "set null" }),
    name: varchar("name", { length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    size: bigint("size", { mode: "number" }).notNull(),
    storageKey: text("storage_key").notNull(),
    pageCount: integer("page_count"),
    status: fileStatusEnum("status").default("uploading").notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    checksum: varchar("checksum", { length: 128 }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("files_user_created_idx").on(table.userId, table.createdAt), index("files_folder_idx").on(table.folderId)],
);

export const processingJobs = pgTable(
  "processing_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    inputFileId: uuid("input_file_id").references(() => files.id, { onDelete: "set null" }),
    outputFileId: uuid("output_file_id").references(() => files.id, { onDelete: "set null" }),
    toolSlug: varchar("tool_slug", { length: 100 }).notNull(),
    status: jobStatusEnum("status").default("queued").notNull(),
    progress: integer("progress").default(0).notNull(),
    options: jsonb("options").$type<Record<string, unknown>>().default({}).notNull(),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("jobs_user_created_idx").on(table.userId, table.createdAt), index("jobs_status_idx").on(table.status)],
);

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    fileId: uuid("file_id").references(() => files.id, { onDelete: "cascade" }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("ai_conversations_user_idx").on(table.userId)],
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").references(() => aiConversations.id, { onDelete: "cascade" }).notNull(),
    role: varchar("role", { length: 16 }).notNull(),
    content: text("content").notNull(),
    citations: jsonb("citations").$type<Array<{ page: number; text: string }>>().default([]).notNull(),
    tokensUsed: integer("tokens_used").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("ai_messages_conversation_idx").on(table.conversationId, table.createdAt)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    providerCustomerId: varchar("provider_customer_id", { length: 255 }),
    providerSubscriptionId: varchar("provider_subscription_id", { length: 255 }),
    plan: planEnum("plan").notNull(),
    status: varchar("status", { length: 32 }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("subscriptions_user_idx").on(table.userId)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    type: varchar("type", { length: 40 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    body: text("body").notNull(),
    href: text("href"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("notifications_user_idx").on(table.userId, table.createdAt)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }),
    entityId: varchar("entity_id", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 64 }),
    context: jsonb("context").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("audit_logs_user_idx").on(table.userId, table.createdAt), index("audit_logs_action_idx").on(table.action)],
);

export type User = typeof users.$inferSelect;
export type StoredFile = typeof files.$inferSelect;
export type ProcessingJob = typeof processingJobs.$inferSelect;
