import { boolean, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const tbl_course_progresses = pgTable('tbl_course_progresses', {
    id: uuid('id').defaultRandom().primaryKey(),
    progress_percent: integer('progress_percent').notNull().default(0),
    is_completed: boolean('is_completed').notNull().default(false),
    enrollment_id: uuid('enrollment_id').notNull().references(() => tbl_user_enrollments.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})

export const tbl_user_enrollments = pgTable('tbl_user_enrollments', {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id').notNull(),
    course_id: uuid('course_id').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').$onUpdate(() => new Date())
})