import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { StoreHeader } from "@/src/pages/CartPage";
import { formatSar } from "@/src/data/storePricing";
import {
  attachMoyasarPayment,
  getMoyasarPublishableKey,
  getOrderForPayment,
  isMoyasarConfigured,
  loadMoyasarAssets,
  sarToHalalas,
  type PaymentOrderInfo,
} from "@/src/services/payments";

export default function PaymentPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [order, setOrder] = useState<PaymentOrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const configured = isMoyasarConfigured();
  const amountLabel = useMemo(
    () => (order ? formatSar(Number(order.total_sar)) : ""),
    [order],
  );

  useEffect(() => {
    if (!token) {
      setError("رابط الدفع غير صالح");
      setLoading(false);
      return;
    }
    let cancelled = false;
    void getOrderForPayment(token)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("الطلب غير موجود");
          return;
        }
        if (data.payment_status === "paid") {
          navigate("/order-success", {
            replace: true,
            state: {
              orderNumber: data.order_number,
              totalSar: Number(data.total_sar),
              paymentMethod: "card",
              paid: true,
            },
          });
          return;
        }
        setOrder(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "تعذر تحميل الطلب");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  useEffect(() => {
    if (!order || !configured || !token) return;

    let disposed = false;
    const mount = async () => {
      try {
        await loadMoyasarAssets();
        if (disposed || !window.Moyasar) return;

        const container = document.querySelector(".mysr-form");
        if (container) container.innerHTML = "";

        const callbackUrl = `${window.location.origin}/payment/callback?token=${encodeURIComponent(token)}`;
        const amount = sarToHalalas(Number(order.total_sar));
        if (amount < 100) {
          setError("الحد الأدنى للدفع الإلكتروني 1 ر.س");
          return;
        }

        window.Moyasar.init({
          element: ".mysr-form",
          amount,
          currency: order.currency || "SAR",
          description: `طلب تسامي ${order.order_number}`,
          publishable_api_key: getMoyasarPublishableKey(),
          callback_url: callbackUrl,
          methods: ["creditcard"],
          supported_networks: ["mada", "visa", "mastercard", "amex"],
          metadata: {
            order_id: order.id,
            order_number: order.order_number,
            payment_token: token,
          },
          on_completed: async (payment: { id: string }) => {
            try {
              await attachMoyasarPayment(token, payment.id);
            } catch (err) {
              console.warn("[attach moyasar]", err);
            }
          },
        });
      } catch (err) {
        if (!disposed) {
          setError(
            err instanceof Error ? err.message : "تعذر تهيئة نموذج الدفع",
          );
        }
      }
    };

    void mount();
    return () => {
      disposed = true;
    };
  }, [order, configured, token]);

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <StoreHeader title="الدفع الإلكتروني" />
      <main className="max-w-xl mx-auto px-4 py-8 space-y-5">
        <div>
          <h1 className="text-2xl font-black text-[#0A182D]">إتمام الدفع</h1>
          <p className="text-sm text-slate-500 mt-1">
            بطاقات مدى / فيزا / ماستركارد عبر Moyasar
          </p>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">جاري تجهيز صفحة الدفع...</p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!configured && !loading && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm space-y-2">
            <p className="font-bold">مفتاح Moyasar غير مضبوط بعد</p>
            <p>
              أضف <code className="font-mono text-xs">VITE_MOYASAR_PUBLISHABLE_KEY</code>{" "}
              و{" "}
              <code className="font-mono text-xs">MOYASAR_SECRET_KEY</code> في
              Vercel ثم أعد النشر.
            </p>
            <Link to="/checkout" className="font-bold text-[#E66A1F] underline">
              الرجوع لإتمام الطلب بدون بطاقة
            </Link>
          </div>
        )}

        {order && (
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">رقم الطلب</span>
              <span className="font-black" dir="ltr">
                {order.order_number}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">المؤسسة</span>
              <span className="font-bold">{order.business_name}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-100 pt-3">
              <span className="text-slate-500">المبلغ</span>
              <span className="font-black text-lg text-[#0A182D]">
                {amountLabel}
              </span>
            </div>
          </div>
        )}

        {configured && order && !error && (
          <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5">
            <div className="mysr-form" />
          </div>
        )}

        <Link
          to="/order-success"
          state={{
            orderNumber: order?.order_number,
            totalSar: order ? Number(order.total_sar) : 0,
            paymentMethod: "card",
            paid: false,
          }}
          className="block text-center text-sm font-bold text-slate-500"
        >
          الدفع لاحقاً ومتابعة الطلب
        </Link>
      </main>
    </div>
  );
}
