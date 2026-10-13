import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "@/src/hooks/useCart";
import { useAuth } from "@/src/hooks/useAuth";
import { createOrder } from "@/src/services/orders";
import { formatSar } from "@/src/data/storePricing";
import { isMoyasarConfigured } from "@/src/services/payments";
import type { PaymentMethod } from "@/src/types/database";
import { StoreHeader } from "@/src/pages/CartPage";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardReady = isMoyasarConfigured();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    cardReady ? "card" : "later",
  );

  if (!items.length) {
    return <Navigate to="/cart" replace />;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      const order = await createOrder({
        business_name: String(data.get("business") || ""),
        phone: String(data.get("phone") || ""),
        city: String(data.get("city") || ""),
        address: String(data.get("address") || ""),
        notes: String(data.get("notes") || ""),
        payment_method: paymentMethod,
        user_id: user?.id ?? null,
        items: items.map((l) => ({
          catalog_id: l.catalogId,
          title: l.title,
          image_url: l.imageUrl,
          unit: l.unit,
          unit_price_sar: l.unitPriceSar,
          quantity: l.quantity,
        })),
      });

      if (paymentMethod === "card") {
        if (!order.payment_token) {
          throw new Error("تعذر إنشاء رابط الدفع. حدّث قاعدة البيانات ثم أعد المحاولة.");
        }
        clear();
        navigate(`/pay?token=${encodeURIComponent(order.payment_token)}`, {
          replace: true,
        });
        return;
      }

      clear();
      navigate("/order-success", {
        replace: true,
        state: {
          orderNumber: order.order_number,
          totalSar: order.total_sar,
          paymentMethod: order.payment_method,
          paid: false,
        },
      });
    } catch (err) {
      console.error("[checkout]", err);
      setError(
        err instanceof Error
          ? err.message
          : "تعذر إنشاء الطلب. تأكد من اتصال قاعدة البيانات.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <StoreHeader title="إتمام الطلب" />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0A182D]">بيانات التوصيل</h1>
          <p className="text-sm text-slate-500 mt-1">
            اختر طريقة الدفع: بطاقة إلكترونية، تحويل بنكي، أو تأكيد لاحقاً مع الفريق.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid lg:grid-cols-[1.35fr_0.85fr] gap-6 items-start"
        >
          <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
            <Field label="اسم المؤسسة / المطعم" name="business" required placeholder="مثال: مطعم الياسمين" />
            <Field label="رقم الجوال" name="phone" required type="tel" placeholder="05XXXXXXXX" />
            <Field label="المدينة" name="city" required placeholder="الرياض" />
            <Field label="العنوان / الحي" name="address" placeholder="اختياري — للتوصيل" />
            <div>
              <label className="block text-sm font-bold text-[#0A182D] mb-2">ملاحظات</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="أوقات الاستلام، متطلبات خاصة..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40"
              />
            </div>

            <div>
              <div className="text-sm font-bold text-[#0A182D] mb-2">طريقة الدفع</div>
              <div className="space-y-2">
                <PayOption
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  title="بطاقة مدى / فيزا / ماستركارد"
                  desc={
                    cardReady
                      ? "دفع فوري عبر Moyasar ثم تأكيد الطلب تلقائياً."
                      : "فعّل مفاتيح Moyasar في الإعدادات لتفعيل الدفع بالبطاقة."
                  }
                  disabled={!cardReady}
                />
                <PayOption
                  checked={paymentMethod === "later"}
                  onChange={() => setPaymentMethod("later")}
                  title="تأكيد لاحقاً"
                  desc="يسجّل الطلب ويتواصل معك الفريق لإتمام التوريد والدفع."
                />
                <PayOption
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  title="تحويل بنكي"
                  desc="نرسل بيانات الحساب بعد تأكيد الطلب."
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </section>

          <aside className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 sticky top-4">
            <h2 className="font-black text-[#0A182D]">ملخص</h2>
            <ul className="space-y-2 max-h-56 overflow-auto text-sm">
              {items.map((l) => (
                <li key={l.catalogId} className="flex justify-between gap-2">
                  <span className="text-slate-600 truncate">
                    {l.title} × {l.quantity}
                  </span>
                  <span className="font-bold shrink-0">
                    {formatSar(l.unitPriceSar * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-slate-100 pt-3">
              <span className="text-slate-500 text-sm">الإجمالي التقديري</span>
              <span className="font-black text-lg text-[#0A182D]">
                {formatSar(subtotal)}
              </span>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 text-white py-3 text-sm font-extrabold"
            >
              {busy
                ? "جاري المتابعة..."
                : paymentMethod === "card"
                  ? "متابعة للدفع"
                  : "تأكيد الطلب"}
            </button>
            <Link to="/cart" className="block text-center text-sm font-bold text-[#E66A1F]">
              تعديل السلة
            </Link>
          </aside>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-bold text-[#0A182D] mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40"
      />
    </div>
  );
}

function PayOption({
  checked,
  onChange,
  title,
  desc,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex gap-3 rounded-xl border px-3 py-3 cursor-pointer ${
        disabled
          ? "opacity-50 cursor-not-allowed border-slate-100"
          : checked
            ? "border-[#F4B41A] bg-[#FFFBEB]"
            : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-1"
      />
      <span>
        <span className="block text-sm font-bold text-[#0A182D]">{title}</span>
        <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
      </span>
    </label>
  );
}
