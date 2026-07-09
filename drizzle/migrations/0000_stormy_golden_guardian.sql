CREATE TABLE "vents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"mode" text DEFAULT 'comedy' NOT NULL,
	"mood_tag" text NOT NULL,
	"mood_color" text NOT NULL,
	"real_talk" text NOT NULL,
	"prompts" json DEFAULT '[]'::json NOT NULL,
	"song_lyrics" text,
	"dance_steps" json DEFAULT '[]'::json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
