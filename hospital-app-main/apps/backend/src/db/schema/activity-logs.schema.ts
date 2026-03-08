import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { users } from "./rbac";

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    module: varchar("module", { length: 100 }).notNull(),

    action: varchar("action", { length: 100 }).notNull(),

    entityType: varchar("entity_type", { length: 100 }),

    entityId: uuid("entity_id"),

    metadata: jsonb("metadata"),

    ipAddress: varchar("ip_address", { length: 100 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIndex: index("activity_logs_user_idx").on(table.userId),
    moduleIndex: index("activity_logs_module_idx").on(table.module),
    entityIndex: index("activity_logs_entity_idx").on(table.entityId),
    createdAtIndex: index("activity_logs_created_at_idx").on(table.createdAt),
  }),
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
