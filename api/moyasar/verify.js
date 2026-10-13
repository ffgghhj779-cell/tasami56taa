/**
 * Verify Moyasar payment after callback redirect.
 * GET /api/moyasar/verify?id=<payment_id>&token=<payment_token>
 *
 * Env (Vercel):
 *   MOYASAR_SECRET_KEY=sk_test_... or sk_live_...
 *   SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  const paymentId = String(req.query.id || "").trim();
  const token = String(req.query.token || "").trim();
  if (!paymentId) return res.status(400).json({ error: "missing_payment_id" });

  const secret = process.env.MOYASAR_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "server_misconfigured" });
  }

  try {
    const auth = Buffer.from(`${secret}:`).toString("base64");
    const payRes = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const payment = await payRes.json();
    if (!payRes.ok) {
      return res.status(payRes.status).json({
        error: "moyasar_fetch_failed",
        details: payment,
      });
    }

    if (payment.status !== "paid") {
      return res.status(200).json({
        ok: false,
        status: payment.status,
        order: null,
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
        },
      });
    }

    // Optional token check against metadata
    const metaToken = payment.metadata?.payment_token;
    if (token && metaToken && token !== metaToken) {
      return res.status(403).json({ error: "token_mismatch" });
    }

    const markRes = await fetch(`${supabaseUrl}/rest/v1/rpc/mark_order_paid_by_moyasar`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_payment_id: payment.id,
        p_amount_halalas: payment.amount,
        p_currency: payment.currency || "SAR",
        p_raw: payment,
      }),
    });

    const marked = await markRes.json().catch(() => null);
    if (!markRes.ok) {
      return res.status(502).json({
        error: "mark_paid_failed",
        details: marked,
        payment_status: payment.status,
      });
    }

    return res.status(200).json({
      ok: true,
      status: "paid",
      order: marked,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      },
    });
  } catch (err) {
    console.error("[moyasar/verify]", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
