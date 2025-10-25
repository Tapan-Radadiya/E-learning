ALTER TABLE "tbl_user" ALTER COLUMN "user_role" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "tbl_user" ALTER COLUMN "user_role" SET DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE "tbl_user" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_organization_id_tbl_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."tbl_organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."user_role";