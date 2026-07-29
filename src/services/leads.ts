import { supabase, supabaseConfigured } from "@/src/lib/supabase";
import type { QuoteRequestInsert, QuoteStatus } from "@/src/types/database";

export async function submitQuoteRequest(payload: QuoteRequestInsert) {
  if (!supabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function listQuoteRequests() {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listMyQuoteRequests(userId: string) {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateQuoteStatus(id: string, status: QuoteStatus) {
  const { error } = await supabase
    .from("quote_requests")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

export async function updateQuoteNotes(id: string, notes: string) {
  const { error } = await supabase
    .from("quote_requests")
    .update({ notes })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteQuoteRequest(id: string) {
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  if (error) throw error;
}
