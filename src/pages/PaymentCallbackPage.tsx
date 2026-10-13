import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { StoreHeader } from "@/src/pages/CartPage";
import { formatSar } from "@/src/data/storePricing";
import { verifyMoyasarPayment } from "@/src/services/payments";

export default function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = params.get("id") || "";
  const token = params.get("token") || "";
  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading");
  const [message, setMessage] = useState("جاري التحقق من الدفع...");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [totalSar, setTotalSar] = useState<number>(0);

  useEffect(() => {
    if (!paymentId) {
      setStatus("failed");
      setMessage("معرّف الدفع مفقود");
      return;
    }

    let cancelled = false;
    void verifyMoyasarPayment(paymentId, token)
      .then((result) => {
        if (cancelled) return;
        if (result.ok && result.status === "paid") {
          setStatus("paid");
          setMessage("تم الدفع بنجاح");
          setOrderNumber(result.order?.order_number || "");
          setTotalSar(Number(result.order?.total_sar || result.payment.amount / 100));
          window.setTimeout(() => {
            navigate("/order-success", {
              replace: true,
              state: {
                orderNumber: result.order?.order_number,
                totalSar: Number(result.order?.total_sar || result.payment.amount / 100),
                paymentMethod: "card",
                paid: true,
              },
            });
          }, 1200);
        } else {
          setStatus("failed");
          setMessage(`حالة الدفع: ${result.status || "غير مكتمل"}`);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("failed");
        setMessage(err instanceof Error ? err.message : "فشل التحقق من الدفع");
      });

    return () => {
      cancelled = true;
    };
  }, [paymentId, token, navigate]);

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <StoreHeader title="نتيجة الدفع" />
      <main className="max-w-xl mx-auto px-4 py-14 text-center space-y-5">
        {status === "loading" && (
          <div className="h-12 w-12 rounded-full border-2 border-[#F4B41A] border-t-transparent animate-spin mx-auto" />
        )}
        {status === "paid" && (
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
        )}
        {status === "failed" && (
          <XCircle className="h-14 w-14 text-red-500 mx-auto" />
        )}
        <h1 className="text-2xl font-black text-[#0A182D]">{message}</h1>
        {orderNumber && (
          <p className="text-sm text-slate-600" dir="ltr">
            {orderNumber}
            {totalSar > 0 ? ` · ${formatSar(totalSar)}` : ""}
          </p>
        )}
        {status === "failed" && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {token && (
              <Link
                to={`/pay?token=${encodeURIComponent(token)}`}
                className="rounded-xl bg-[#0E2A47] text-white px-5 py-3 text-sm font-extrabold"
              >
                إعادة المحاولة
              </Link>
            )}
            <Link
              to="/"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold"
            >
              الرئيسية
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
