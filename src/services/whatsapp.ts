import { supabase } from "@/src/lib/supabase";

export type WhatsAppOrder = {
  id: number;
  phone: string;
  customer_name: string | null;
  customer_message: string | null;
  sara_reply: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

export type BotPause = {
  phone: string;
  pause_until: string;
  reason: string | null;
};

export type WhatsAppStats = {
  ok: boolean;
  ordersToday: number;
  ordersWeek: number;
  ordersTotal: number;
  botPaused: number;
};

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("يجب تسجيل الدخول أولاً");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchWhatsAppStats(): Promise<WhatsAppStats> {
  const res = await fetch("/api/admin/whatsapp/stats", {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "تعذر تحميل الإحصائيات");
  return data;
}

export async function fetchWhatsAppOrders(): Promise<{
  orders: WhatsAppOrder[];
  pauses: BotPause[];
}> {
  const res = await fetch("/api/admin/whatsapp/orders", {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "تعذر تحميل الطلبات");
  return { orders: data.orders ?? [], pauses: data.pauses ?? [] };
}

export async function updateWhatsAppOrderStatus(id: number, status: string) {
  const res = await fetch("/api/admin/whatsapp/orders", {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "تعذر تحديث الحالة");
}

export async function sendWhatsAppMessage(phone: string, message: string) {
  const res = await fetch("/api/admin/whatsapp/send", {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ phone, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "تعذر إرسال الرسالة");
  return data;
}

export function formatSaPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("966")) return `+${d}`;
  if (d.startsWith("0")) return `+966${d.slice(1)}`;
  if (d.startsWith("5")) return `+966${d}`;
  return `+${d}`;
}

export const ORDER_STATUSES = [
  { value: "received", label: "مستلم" },
  { value: "processing", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغى" },
] as const;
