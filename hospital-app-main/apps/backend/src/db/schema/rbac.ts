import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* ============================================================
   Shared Timestamps
============================================================ */

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

/* ============================================================
   Departments
============================================================ */

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  ...timestamps,
});

/* ============================================================
   Roles
============================================================ */

export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),

  ...timestamps,
});

/* ============================================================
   Permissions
============================================================ */

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  code: varchar("code", { length: 150 }).notNull().unique(),
  description: text("description"),

  ...timestamps,
});

/* ============================================================
   Users
============================================================ */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  supabaseUid: uuid("supabase_uid").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),

  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),

  isActive: varchar("is_active", { length: 10 }).default("true").notNull(),

  ...timestamps,
});

/* ============================================================
   User Roles (Many-to-Many)
============================================================ */

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),

  ...timestamps,
});

/* ============================================================
   Role Permissions (Many-to-Many)
============================================================ */

export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),

  roleId: uuid("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),

  permissionId: uuid("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),

  ...timestamps,
});

/* ============================================================
   Relations
============================================================ */

export const departmentsRelations = relations(departments, ({ many }) => ({
  users: many(users),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),

  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),

  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),

    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

/* ============================================================
   Types
============================================================ */

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
