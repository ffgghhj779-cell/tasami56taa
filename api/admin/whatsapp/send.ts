import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireTeam } from "../../_lib/auth.js";
import { sendWhatsAppViaN8n } from "../../_lib/whatsapp-db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await requireTeam(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const body = req.body as { phone?: string; message?: string };
  const phone = body?.phone?.replace(/\D/g, "").trim();
  const message = body?.message?.trim();
  if (!phone || !message) {
    return res.status(400).json({ error: "phone and message required" });
  }

  const result = await sendWhatsAppViaN8n(phone, message);
  if (!result.ok) {
    return res.status(502).json({ error: result.error });
  }
  return res.status(200).json({ ok: true, ...result.data });
}
