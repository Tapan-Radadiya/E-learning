CREATE TABLE "tbl_course_progresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_user_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tbl_course_progresses" ADD CONSTRAINT "tbl_course_progresses_enrollment_id_tbl_user_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."tbl_user_enrollments"("id") ON DELETE no action ON UPDATE no action;