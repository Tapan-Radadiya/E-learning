ALTER TABLE "tbl_user_refresh_tokens" DROP CONSTRAINT "tbl_user_refresh_tokens_user_id_tbl_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tbl_user_refresh_tokens" ADD CONSTRAINT "tbl_user_refresh_tokens_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE cascade ON UPDATE no action;