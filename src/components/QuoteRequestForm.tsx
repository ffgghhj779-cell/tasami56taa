import { FormEvent, useState } from "react";
import { catalogFormOptions } from "@/src/data/catalog";
import { submitQuoteRequest } from "@/src/services/leads";
import { useAuth } from "@/src/hooks/useAuth";

type Props = {
  productOptions?: string[];
  defaultProduct?: string;
  autoFocusFirst?: boolean;
};

export default function QuoteRequestForm({
  productOptions = catalogFormOptions,
  defaultProduct = "",
  autoFocusFirst = false,
}: Props) {
  const { user } = useAuth();
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const initialProduct =
    defaultProduct && productOptions.includes(defaultProduct) ? defaultProduct : "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setFormStatus("sending");
    try {
      await submitQuoteRequest({
        business: String(data.get("business") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        city: String(data.get("city") || "").trim(),
        product: String(data.get("product") || "").trim(),
        quantity: String(data.get("quantity") || "").trim(),
        user_id: user?.id ?? null,
      });
      setFormStatus("success");
      form.reset();
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <form
      id="quote-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl space-y-4 sm:space-y-5 text-start"
    >
      <h3 className="text-2xl font-black text-[#0A182D] mb-2 text-center">
        📝 قدم طلب توريد الآن
      </h3>

      <div>
        <label htmlFor="business" className="block text-sm font-bold text-[#0A182D] mb-2">
          اسم المؤسسة أو المطعم
        </label>
        <input
          id="business"
          name="business"
          type="text"
          required
          autoFocus={autoFocusFirst}
          placeholder="مثال: مطعم الياسمين"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-bold text-[#0A182D] mb-2">
          رقم الجوال (مهم للتواصل السريع)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          dir="ltr"
          placeholder="05XXXXXXXX"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-bold text-[#0A182D] mb-2">
          المدينة / المنطقة الجغرافية
        </label>
        <input
          id="city"
          name="city"
          type="text"
          required
          placeholder="مثال: الرياض — حي النرجس"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all"
        />
      </div>

      <div>
        <label htmlFor="product" className="block text-sm font-bold text-[#0A182D] mb-2">
          المنتج المطلوب
        </label>
        <select
          id="product"
          name="product"
          required
          key={initialProduct || "empty"}
          defaultValue={initialProduct}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            اختر المنتج المطلوب توريده...
          </option>
          {productOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-bold text-[#0A182D] mb-2">
          الكمية المطلوبة
        </label>
        <textarea
          id="quantity"
          name="quantity"
          required
          rows={4}
          placeholder="الكمية المطلوبة (مثال: 100 كيس بطاطس، 500 كرتون بيض)"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all resize-y min-h-[110px]"
        />
      </div>

      {formStatus === "success" && (
        <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm font-bold">
          تم إرسال طلبك بنجاح. سنتواصل معك قريباً بعرض السعر.
        </div>
      )}
      {formStatus === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-bold">
          حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر الواتساب.
        </div>
      )}

      <button
        type="submit"
        disabled={formStatus === "sending"}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-70 text-white py-4 px-6 rounded-md font-extrabold text-lg transition-all hover:scale-[1.01]"
      >
        {formStatus === "sending" ? "جاري الإرسال..." : "🛒 إرسال طلب التوريد (جملة)"}
      </button>
    </form>
  );
}
