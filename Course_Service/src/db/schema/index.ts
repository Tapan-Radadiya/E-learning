import { boolean, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const tbl_courses = pgTable('tbl_courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title').notNull(),
    description: varchar('description').notNull(),
    thumbnail_url: varchar('thumbnail_url').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
})


export const tbl_course_modules = pgTable('tbl_course_modules', {
    id: uuid('id').defaultRandom().primaryKey(),
    course_id: uuid('course_id').notNull().references(() => tbl_courses.id, { onDelete: 'cascade' }),
    video_url: varchar('video_url').notNull(),
    title: varchar('title').notNull(),
    description: varchar('description').notNull(),
    completion_percentage: integer('completion_percentage').notNull().default(0),
    is_module_live: boolean('is_module_live').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
})