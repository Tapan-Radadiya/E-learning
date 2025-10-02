CREATE TABLE "tbl_course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"video_url" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	"is_module_live" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"thumbnail_url" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tbl_course_modules" ADD CONSTRAINT "tbl_course_modules_course_id_tbl_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."tbl_courses"("id") ON DELETE cascade ON UPDATE no action;