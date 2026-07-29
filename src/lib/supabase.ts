import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database";

/** Public anon keys only — safe in the browser (RLS still applies). */
const FALLBACK_URL = "https://wksivqjlabpiwfzuwuwh.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrc2l2cWpsYWJwaXdmenV3dXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDUyMDEsImV4cCI6MjEwMDkyMTIwMX0.2C3tU0Wj99DT0M8v8O7POA8W7zK9VQCUBaryBVk_2oo";

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
