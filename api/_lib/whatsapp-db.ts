import { neon } from "@neondatabase/serverless";

function sql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  return neon(url);
}

export type WhatsAppOrderRow = {
  id: number;
  phone: string;
  customer_name: string | null;
  customer_message: string | null;
  sara_reply: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

export type BotPauseRow = {
  phone: string;
  pause_until: string;
  reason: string | null;
};

export async function getWhatsAppStats() {
  const db = sql();
  if (!db) {
    return {
      ok: false,
      ordersToday: 0,
      ordersWeek: 0,
      ordersTotal: 0,
      botPaused: 0,
    };
  }
  try {
    const [today, week, total, paused] = await Promise.all([
      db`SELECT COUNT(*)::int AS count FROM tasami_orders WHERE created_at >= CURRENT_DATE`,
      db`SELECT COUNT(*)::int AS count FROM tasami_orders WHERE created_at >= NOW() - INTERVAL '7 days'`,
      db`SELECT COUNT(*)::int AS count FROM tasami_orders`,
      db`SELECT COUNT(*)::int AS count FROM tasami_bot_pause WHERE pause_until > NOW()`,
    ]);
    return {
      ok: true,
      ordersToday: Number(today[0]?.count ?? 0),
      ordersWeek: Number(week[0]?.count ?? 0),
      ordersTotal: Number(total[0]?.count ?? 0),
      botPaused: Number(paused[0]?.count ?? 0),
    };
  } catch {
    return {
      ok: false,
      ordersToday: 0,
      ordersWeek: 0,
      ordersTotal: 0,
      botPaused: 0,
    };
  }
}

export async function listWhatsAppOrders(limit = 50): Promise<WhatsAppOrderRow[]> {
  const db = sql();
  if (!db) return [];
  const rows = await db`
    SELECT id, phone, customer_name, customer_message, sara_reply, status, source, created_at::text
    FROM tasami_orders
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows as WhatsAppOrderRow[];
}

export async function listBotPauses(limit = 20): Promise<BotPauseRow[]> {
  const db = sql();
  if (!db) return [];
  const rows = await db`
    SELECT phone, pause_until::text, reason
    FROM tasami_bot_pause
    WHERE pause_until > NOW()
    ORDER BY pause_until DESC
    LIMIT ${limit}
  `;
  return rows as BotPauseRow[];
}

export async function updateOrderStatus(id: number, status: string) {
  const allowed = ["received", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return false;
  const db = sql();
  if (!db) return false;
  try {
    await db`UPDATE tasami_orders SET status = ${status} WHERE id = ${id}`;
    return true;
  } catch {
    return false;
  }
}

export async function sendWhatsAppViaN8n(phone: string, message: string) {
  const secret = process.env.SUPERVISOR_WEBHOOK_SECRET?.trim();
  const url =
    process.env.N8N_SUPERVISOR_WEBHOOK_URL?.trim() ||
    "https://n8n.esteemmediaa.com/webhook/tasami-supervisor-reply";
  if (!secret) {
    return { ok: false as const, error: "SUPERVISOR_WEBHOOK_SECRET not configured" };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      phone: phone.replace(/\D/g, ""),
      message,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false as const, error: text.slice(0, 200) };
  }
  try {
    return { ok: true as const, data: JSON.parse(text) };
  } catch {
    return { ok: true as const, data: { raw: text } };
  }
}
