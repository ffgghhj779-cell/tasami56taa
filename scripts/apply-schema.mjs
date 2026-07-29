/**
 * Apply supabase/migrations/*.sql via Management API.
 *
 * Usage:
 *   set SUPABASE_ACCESS_TOKEN=sbp_xxx
 *   node scripts/apply-schema.mjs
 *
 * Token: https://supabase.com/dashboard/account/tokens
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const PROJECT_REF = "wksivqjlabpiwfzuwuwh";
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error(
    "Missing SUPABASE_ACCESS_TOKEN.\nCreate one at: https://supabase.com/dashboard/account/tokens\nThen: $env:SUPABASE_ACCESS_TOKEN='sbp_...'; node scripts/apply-schema.mjs",
  );
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = join(root, "supabase", "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

for (const file of files) {
  const query = readFileSync(join(migrationsDir, file), "utf8");
  console.log(`Applying ${file}...`);
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );
  const body = await res.text();
  if (!res.ok) {
    console.error(`Failed ${file}:`, res.status, body);
    process.exit(1);
  }
  console.log(`OK ${file}`);
}

console.log("Schema applied successfully.");
