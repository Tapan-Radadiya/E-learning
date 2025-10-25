ALTER TABLE "tbl_user" ALTER COLUMN "user_role" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tbl_user" ALTER COLUMN "user_role" SET DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE "tbl_user" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint

DROP TYPE "public"."user_role";