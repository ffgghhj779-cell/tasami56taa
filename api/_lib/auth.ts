import { createClient } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

function env() {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.VITE_SUPABASE_URL?.trim();
  const anonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.VITE_SUPABASE_ANON_KEY?.trim();
  return { url, anonKey };
}

export async function requireTeam(req: VercelRequest) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { ok: false as const, status: 401, error: "Unauthorized" };

  const { url, anonKey } = env();
  if (!url || !anonKey) {
    return { ok: false as const, status: 500, error: "Supabase not configured" };
  }

  const sb = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  if (userErr || !userData.user) {
    return { ok: false as const, status: 401, error: "Invalid session" };
  }

  const sbAuth = createClient(url, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: profile, error: profileErr } = await sbAuth
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileErr || !profile) {
    return { ok: false as const, status: 403, error: "Profile not found" };
  }

  if (profile.role !== "admin" && profile.role !== "staff") {
    return { ok: false as const, status: 403, error: "Forbidden" };
  }

  return { ok: true as const, userId: userData.user.id, role: profile.role };
}
