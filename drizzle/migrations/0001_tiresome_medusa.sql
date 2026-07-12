CREATE TABLE "daily_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"date" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"email" text NOT NULL,
	"razorpay_order_id" text NOT NULL,
	"razorpay_payment_id" text NOT NULL,
	"plan" text DEFAULT 'premium' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
ALTER TABLE "vents" ADD COLUMN "ai_text" text;--> statement-breakpoint
ALTER TABLE "vents" ADD COLUMN "device_id" text;