CREATE TABLE IF NOT EXISTS "project1_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"author_id" integer,
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project1_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"author_id" integer,
	"updatedAt" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
