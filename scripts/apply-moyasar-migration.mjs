import { readFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const PROJECT_REF = "wksivqjlabpiwfzuwuwh";
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

const sql = readFileSync(
  new URL("../supabase/migrations/20260907200000_moyasar_payments.sql", import.meta.url),
  "utf8",
);

// Split on blank-line-separated major statements carefully — run whole file via chunks of statements ending with ;
// Better: send as raw text chunks of functions

const chunks = [
  `alter table public.orders
  add column if not exists payment_token uuid not null default gen_random_uuid(),
  add column if not exists moyasar_payment_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists payment_raw jsonb;

create unique index if not exists orders_payment_token_uidx
  on public.orders (payment_token);

create unique index if not exists orders_moyasar_payment_id_uidx
  on public.orders (moyasar_payment_id)
  where moyasar_payment_id is not null;`,
];

// Extract function bodies from file by splitting on "create or replace function"
const parts = sql.split(/(?=create or replace function)/i).filter((p) => p.trim());
for (const p of parts) {
  if (/create or replace function/i.test(p)) chunks.push(p.trim());
}

for (let i = 0; i < chunks.length; i++) {
  const query = chunks[i];
  console.log(`Applying chunk ${i + 1}/${chunks.length} (${query.length} chars)...`);
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
  const text = await res.text();
  if (!res.ok) {
    console.error(`Failed chunk ${i + 1}:`, res.status, text.slice(0, 2000));
    process.exit(1);
  }
  console.log(`OK chunk ${i + 1}`);
}

console.log("Moyasar migration applied.");
