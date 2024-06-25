ALTER TABLE "project1_post" ALTER COLUMN "author_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project1_post" ADD CONSTRAINT "project1_post_author_id_project1_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."project1_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
