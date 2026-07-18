ALTER TABLE vents ADD COLUMN IF NOT EXISTS email text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_vents_email ON vents(email);
