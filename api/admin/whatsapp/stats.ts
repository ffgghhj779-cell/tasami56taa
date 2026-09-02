import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireTeam } from "../../_lib/auth.js";
import { getWhatsAppStats } from "../../_lib/whatsapp-db.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await requireTeam(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const stats = await getWhatsAppStats();
  return res.status(200).json(stats);
}
