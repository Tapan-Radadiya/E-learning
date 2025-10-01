import { boolean, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER'])

export const tbl_user = pgTable("tbl_user", {
    id: uuid('id').primaryKey().defaultRandom(),
    display_name: varchar('display_name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    user_role: userRoleEnum('user_role').notNull().default('USER'),
    is_mfa_enabled: boolean('is_mfa_enabled').notNull().default(false),
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