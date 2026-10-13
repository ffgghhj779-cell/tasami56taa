/**
 * Moyasar webhook — mark orders paid on payment_paid.
 * POST /api/moyasar/webhook
 *
 * Env:
 *   MOYASAR_SECRET_KEY
 *   MOYASAR_WEBHOOK_SECRET (optional but recommended)
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import crypto from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const secret = process.env.MOYASAR_SECRET_KEY;
  const webhookSecret = process.env.MOYASAR_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const rawBody =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});

  if (webhookSecret) {
    const signature = String(req.headers["x-moyasar-signature"] || "");
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).json({ error: "invalid_signature" });
    }
  }

  let event;
  try {
    event = typeof req.body === "object" && req.body ? req.body : JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "invalid_json" });
  }

  const type = event.type || event.event || "";
  const payment = event.data || event.payment || event;

  if (type && !String(type).includes("paid") && payment?.status !== "paid") {
    return res.status(200).json({ ignored: true, type });
  }

  const paymentId = payment?.id;
  if (!paymentId) return res.status(400).json({ error: "missing_payment" });

  try {
    // Re-fetch from Moyasar for trust
    const auth = Buffer.from(`${secret}:`).toString("base64");
    const payRes = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const verified = await payRes.json();
    if (!payRes.ok || verified.status !== "paid") {
      return res.status(200).json({ ok: false, status: verified?.status || "unknown" });
    }

    const markRes = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_order_paid_by_moyasar`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_payment_id: verified.id,
        p_amount_halalas: verified.amount,
        p_currency: verified.currency || "SAR",
        p_raw: verified,
      }),
    });
    const marked = await markRes.json().catch(() => null);
    if (!markRes.ok) {
      console.error("[moyasar/webhook] mark failed", marked);
      return res.status(502).json({ error: "mark_paid_failed", details: marked });
    }

    return res.status(200).json({ ok: true, order: marked });
  } catch (err) {
    console.error("[moyasar/webhook]", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
