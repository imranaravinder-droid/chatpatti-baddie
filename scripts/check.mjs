import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
console.log("Tables:", tables.map(t=>t.table_name).join(", "));

const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='users'`;
console.log("Users columns:", cols.map(c=>c.column_name).join(", "));

const count = await sql`SELECT COUNT(*) as c FROM users`;
console.log("Users count:", count[0].c);
