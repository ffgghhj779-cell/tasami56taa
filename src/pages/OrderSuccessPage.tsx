import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { formatSar } from "@/src/data/storePricing";
import { StoreHeader } from "@/src/pages/CartPage";

type SuccessState = {
  orderNumber?: string;
  totalSar?: number;
  paymentMethod?: string;
  paid?: boolean;
};

export default function OrderSuccessPage() {
  const location = useLocation();
  const state = (location.state || {}) as SuccessState;
  const orderNumber = state.orderNumber || "—";
  const totalSar = state.totalSar ?? 0;
  const paid = Boolean(state.paid);

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <StoreHeader title={paid ? "تم الدفع" : "تم استلام الطلب"} />
      <main className="max-w-xl mx-auto px-4 py-14 text-center space-y-5">
        <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A182D]">
          {paid ? "تم الدفع بنجاح" : "شكراً لطلبك"}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {paid
            ? "استلمنا دفعتك وسيبدأ فريق تسامي تجهيز وتأكيد التوريد."
            : "تم تسجيل طلبك بنجاح. سيتواصل معك فريق تسامي لتأكيد الكميات والسعر النهائي وموعد التوريد."}
        </p>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 text-start space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">رقم الطلب</span>
            <span className="font-black text-[#0A182D]" dir="ltr">
              {orderNumber}
            </span>
          </div>
          {totalSar > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                {paid ? "المبلغ المدفوع" : "الإجمالي التقديري"}
              </span>
              <span className="font-black">{formatSar(totalSar)}</span>
            </div>
          )}
          {state.paymentMethod && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">طريقة الدفع</span>
              <span className="font-bold">
                {state.paymentMethod === "card"
                  ? paid
                    ? "بطاقة (مدفوع)"
                    : "بطاقة"
                  : state.paymentMethod === "bank_transfer"
                    ? "تحويل بنكي"
                    : "تأكيد لاحقاً"}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to="/account"
            className="rounded-xl bg-[#0E2A47] text-white px-5 py-3 text-sm font-extrabold"
          >
            متابعة طلباتي
          </Link>
          <Link
            to="/#products"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#0A182D]"
          >
            متابعة التسوق
          </Link>
        </div>
      </main>
    </div>
  );
}
