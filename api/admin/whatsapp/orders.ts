import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireTeam } from "../../_lib/auth.js";
import {
  listBotPauses,
  listWhatsAppOrders,
  updateOrderStatus,
} from "../../_lib/whatsapp-db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await requireTeam(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === "GET") {
    try {
      const [orders, pauses] = await Promise.all([
        listWhatsAppOrders(50),
        listBotPauses(20),
      ]);
      return res.status(200).json({ orders, pauses });
    } catch {
      return res.status(500).json({ error: "Database error", orders: [], pauses: [] });
    }
  }

  if (req.method === "PATCH") {
    const body = req.body as { id?: number; status?: string };
    const id = body?.id;
    const status = body?.status?.trim();
    if (!id || !status) {
      return res.status(400).json({ error: "id and status required" });
    }
    const ok = await updateOrderStatus(id, status);
    if (!ok) {
      return res.status(400).json({ error: "Update failed" });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
