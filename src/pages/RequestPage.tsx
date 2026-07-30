import { Link, useSearchParams } from "react-router-dom";
import QuoteRequestForm from "@/src/components/QuoteRequestForm";

export default function RequestPage() {
  const [params] = useSearchParams();
  const product = params.get("product")?.trim() || "";

  return (
    <div className="min-h-screen bg-[#0F2442]" dir="rtl">
      <header className="bg-[#0E2A47] border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <img src="/logo-mark.png" alt="" className="h-10 w-auto shrink-0" />
            <div className="min-w-0">
              <div className="font-brand font-black text-white leading-tight">
                تسامي <span className="text-[#2A7A42]">الوطنية</span>
              </div>
              <div className="text-[11px] text-[#E66A1F] font-bold truncate">
                طلب توريد جملة
              </div>
            </div>
          </Link>
          <Link
            to="/#products"
            className="shrink-0 text-sm font-bold text-white/80 hover:text-[#F4B41A] transition-colors"
          >
            ← العودة للمنتجات
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            قدم طلب توريد الآن
          </h1>
          <p className="text-white/65 text-sm sm:text-base">
            املأ البيانات وسيصلك عرض السعر خلال ساعة.
          </p>
        </div>
        <QuoteRequestForm defaultProduct={product} autoFocusFirst />
      </main>
    </div>
  );
}
