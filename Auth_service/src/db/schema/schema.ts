import { boolean, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const tbl_user = pgTable("tbl_user", {
    id: uuid('id').primaryKey().defaultRandom(),
    display_name: varchar('display_name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    user_role: varchar('user_role').notNull().default('USER'),
    is_mfa_enabled: boolean('is_mfa_enabled').notNull().default(false),
    organization_id: uuid('organization_id').references(() => tbl_organization.id).notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_user_refresh_tokens = pgTable("tbl_user_refresh_tokens", {
    user_id: uuid('user_id').unique().primaryKey().references(() => tbl_user.id, { onDelete: 'cascade' }),
    refresh_token: varchar('refresh_token'),
    speakeasy_key: varchar('speakeasy_key'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_organization = pgTable('tbl_organization', {
    id: uuid('id').primaryKey().defaultRandom(),
    org_name: varchar('org_name').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_role_permissions = pgTable('tbl_role_permissions', {
    id: uuid('id').primaryKey().defaultRandom(),
    role_id: uuid('role_id').references(() => tbl_roles.id),
    permission_id: uuid('permission_id').references(() => tbl_permission.id),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
}, (table) => ({
    unique_role_permission: unique().on(table.role_id, table.permission_id)
}))

export const tbl_permission = pgTable('tbl_permission', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    description: varchar('description'),
    is_active: boolean('is_active').default(false),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_roles = pgTable("tbl_roles", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    organization_id: uuid('organization_id').notNull().references(() => tbl_organization.id),
    created_by: uuid('created_by').notNull().references(() => tbl_user.id),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_user_hierarchy = pgTable('tbl_user_hierarchy', {
    id: uuid('id').primaryKey().defaultRandom(),
    parent_role_id: uuid('parent_role_id').references(() => tbl_roles.id),
    organization_id: uuid('organization_id').references(() => tbl_organization.id),
    manager_user_id: uuid('manager_user_id').references(() => tbl_user.id),
    user_id: uuid('user_id').references(() => tbl_user.id)
})