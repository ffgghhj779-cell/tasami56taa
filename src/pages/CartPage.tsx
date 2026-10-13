import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { formatSar } from "@/src/data/storePricing";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
        <StoreHeader title="سلة المشتريات" />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
          <h1 className="text-2xl font-black text-[#0A182D]">سلتك فارغة</h1>
          <p className="text-slate-500 text-sm">أضف منتجات من الكتالوج ثم ارجع هنا لإتمام الطلب.</p>
          <Link
            to="/#products"
            className="inline-flex rounded-xl bg-[#0E2A47] text-white px-5 py-3 text-sm font-extrabold"
          >
            تصفح المنتجات
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]" dir="rtl">
      <StoreHeader title="سلة المشتريات" />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-[#0A182D]">سلتك</h1>
            <p className="text-sm text-slate-500 mt-1">{items.length} أصناف</p>
          </div>
          <button
            type="button"
            onClick={() => clear()}
            className="text-sm font-bold text-red-600 hover:underline"
          >
            تفريغ السلة
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-6">
          <section className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {items.map((line) => (
              <div
                key={line.catalogId}
                className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start"
              >
                <img
                  src={line.imageUrl}
                  alt=""
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#0A182D] text-sm sm:text-base leading-snug">
                    {line.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatSar(line.unitPriceSar)} / {line.unit}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        type="button"
                        className="p-2 hover:bg-slate-50"
                        onClick={() =>
                          setQuantity(line.catalogId, line.quantity - 1)
                        }
                        aria-label="إنقاص"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 text-sm font-bold min-w-10 text-center">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        className="p-2 hover:bg-slate-50"
                        onClick={() =>
                          setQuantity(line.catalogId, line.quantity + 1)
                        }
                        aria-label="زيادة"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.catalogId)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>
                  </div>
                </div>
                <div className="text-sm font-black text-[#0A182D] shrink-0">
                  {formatSar(line.unitPriceSar * line.quantity)}
                </div>
              </div>
            ))}
          </section>

          <aside className="rounded-2xl bg-white border border-slate-200 p-5 h-fit space-y-4">
            <h2 className="font-black text-[#0A182D]">ملخص الطلب</h2>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">المجموع</span>
              <span className="font-black text-[#0A182D]">{formatSar(subtotal)}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              أسعار إرشادية للجملة. التأكيد النهائي والتسليم يتم عبر فريق تسامي.
              بوابة الدفع الإلكتروني في المرحلة التالية.
            </p>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white py-3 text-sm font-extrabold"
            >
              متابعة لإتمام الطلب
            </button>
            <Link
              to="/#products"
              className="block text-center text-sm font-bold text-[#E66A1F]"
            >
              إضافة المزيد
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

export function StoreHeader({ title }: { title: string }) {
  return (
    <header className="bg-[#0E2A47] text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img src="/logo-mark.png" alt="" className="h-10 w-auto" />
          <div className="min-w-0">
            <div className="font-brand font-black truncate">
              تسامي <span className="text-[#2A7A42]">الوطنية</span>
            </div>
            <div className="text-[11px] text-[#E66A1F] font-bold">{title}</div>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-bold text-white/80 hover:text-white"
        >
          <ArrowRight className="h-4 w-4" />
          الرئيسية
        </Link>
      </div>
    </header>
  );
}
