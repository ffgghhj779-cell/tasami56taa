import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — forms and CMS will fall back to local defaults.",
  );
}

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient<Database>(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
