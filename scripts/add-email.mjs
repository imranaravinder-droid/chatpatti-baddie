import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
const poolUrl = process.env.DATABASE_URL;
const directUrl = poolUrl.replace("-pooler", "");
const { Pool } = pg;
const pool = new Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });

await pool.query("ALTER TABLE vents ADD COLUMN IF NOT EXISTS email text");
await pool.query("CREATE INDEX IF NOT EXISTS idx_vents_email ON vents(email)");
const { rows } = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='vents'");
console.log("Vents columns:", rows.map(r => r.column_name).join(", "));
await pool.end();
