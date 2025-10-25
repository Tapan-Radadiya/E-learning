CREATE TABLE "tbl_organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"is_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tbl_role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid,
	"permission_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "tbl_role_permissions_role_id_permission_id_unique" UNIQUE("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "tbl_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "tbl_role_permissions" ADD CONSTRAINT "tbl_role_permissions_role_id_tbl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."tbl_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_role_permissions" ADD CONSTRAINT "tbl_role_permissions_permission_id_tbl_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."tbl_permission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_roles" ADD CONSTRAINT "tbl_roles_organization_id_tbl_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."tbl_organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_roles" ADD CONSTRAINT "tbl_roles_created_by_tbl_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."tbl_user"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- imported from 0003_amazing_earthquake.sql
ALTER TABLE "tbl_user" ADD CONSTRAINT "tbl_user_organization_id_tbl_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."tbl_organization"("id") ON DELETE no action ON UPDATE no action;