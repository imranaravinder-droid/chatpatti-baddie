import { config } from "dotenv";
import { readFileSync } from "fs";
import pg from "pg";

config({ path: ".env.local" });
const poolUrl = process.env.DATABASE_URL;
const directUrl = poolUrl.replace("-pooler", "");
const { Pool } = pg;
const pool = new Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });

const content = readFileSync("drizzle/migrations/0003_curly_skrulls.sql", "utf-8");
const statements = content.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);

for (const stmt of statements) {
  try {
    await pool.query(stmt);
    console.log("OK:", stmt.slice(0, 80));
  } catch (e) {
    console.log("FAIL:", e.message?.slice(0, 100));
  }
}
const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
console.log("Tables:", tables.rows.map(t => t.table_name).join(", "));
await pool.end();
