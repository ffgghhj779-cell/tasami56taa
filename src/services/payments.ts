import { supabase, supabaseConfigured } from "@/src/lib/supabase";

export type PaymentOrderInfo = {
  id: string;
  order_number: string;
  total_sar: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  business_name: string;
  moyasar_payment_id: string | null;
  paid_at: string | null;
};

export function isMoyasarConfigured() {
  return Boolean(
    (import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY as string | undefined)?.trim(),
  );
}

export function getMoyasarPublishableKey() {
  return (
    (import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY as string | undefined)?.trim() ||
    ""
  );
}

/** SAR → halalas (smallest unit) */
export function sarToHalalas(amountSar: number) {
  return Math.round(Number(amountSar) * 100);
}

export async function getOrderForPayment(
  token: string,
): Promise<PaymentOrderInfo | null> {
  if (!supabaseConfigured) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.rpc("get_order_for_payment", {
    p_token: token,
  });
  if (error) throw error;
  return (data as PaymentOrderInfo | null) ?? null;
}

export async function attachMoyasarPayment(token: string, paymentId: string) {
  const { data, error } = await supabase.rpc("attach_moyasar_payment", {
    p_token: token,
    p_payment_id: paymentId,
  });
  if (error) throw error;
  return data;
}

export type MoyasarPayment = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
};

declare global {
  interface Window {
    Moyasar?: {
      init: (config: Record<string, unknown>) => void;
    };
  }
}

export function loadMoyasarAssets(): Promise<void> {
  if (window.Moyasar) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingCss = document.querySelector('link[data-moyasar="css"]');
    if (!existingCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css";
      link.setAttribute("data-moyasar", "css");
      document.head.appendChild(link);
    }

    const existing = document.querySelector('script[data-moyasar="js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("فشل تحميل سكربت Moyasar")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    script.async = true;
    script.setAttribute("data-moyasar", "js");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("فشل تحميل سكربت Moyasar"));
    document.body.appendChild(script);
  });
}

export async function verifyMoyasarPayment(paymentId: string, token: string) {
  const qs = new URLSearchParams({ id: paymentId, token });
  const res = await fetch(`/api/moyasar/verify?${qs.toString()}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "تعذر التحقق من الدفع");
  }
  return body as {
    ok: boolean;
    status: string;
    order: {
      order_number: string;
      total_sar: number;
      payment_status: string;
    } | null;
    payment: { id: string; status: string; amount: number; currency: string };
  };
}
