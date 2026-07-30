import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, ZoomIn } from "lucide-react";
import {
  catalogCategories,
  catalogProducts,
  type CatalogCategoryId,
  type CatalogProduct,
} from "@/src/data/catalog";

const WHATSAPP_URL = "https://wa.me/966550266838";

function quoteWhatsApp(productTitle: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(
    `السلام عليكم، أرغب في طلب تسعيرة لمنتج: ${productTitle}`,
  )}`;
}

export default function ProductsCatalog() {
  const navigate = useNavigate();
  const [active, setActive] = useState<CatalogCategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<CatalogProduct | null>(null);

  function openRequestForm(formValue: string) {
    setPreview(null);
    navigate(`/request?product=${encodeURIComponent(formValue)}`);
  }

  const counts = useMemo(() => {
    const map = Object.fromEntries(
      catalogCategories.map((c) => [c.id, 0]),
    ) as Record<CatalogCategoryId, number>;
    for (const p of catalogProducts) map[p.category] += 1;
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogProducts.filter((p) => {
      const inCat = active === "all" || p.category === active;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q) ||
        p.formValue.toLowerCase().includes(q)
      );
    });
  }, [active, query]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  return (
    <section
      id="products"
      className="relative py-16 sm:py-24 md:py-28 bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_28%,#FFFFFF_100%)] border-t border-slate-100"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-3xl">
            <div className="text-[#E66A1F] text-xs font-bold tracking-[0.18em] uppercase mb-3">
              كتالوج التوريد الفاخر
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl lg:text-[3.4rem] font-black text-[#0A182D] leading-[1.12] tracking-tight mb-4">
              أقسام المنتجات بالجملة
            </h2>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
              {catalogProducts.length} صنفاً مصنّفاً من صور المنتجات الفعلية — الصورة كاملة
              بدون قص، مع مواصفات دقيقة وطلب تسعيرة فوري.
            </p>
          </div>

          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو الماركة..."
              className="w-full rounded-2xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/35 focus:border-[#F4B41A]"
            />
          </div>
        </div>

        <div className="sticky top-[4.5rem] md:top-24 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 mb-10">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-[0_10px_40px_-24px_rgba(14,42,71,0.45)] p-2 sm:p-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
              <Chip
                active={active === "all"}
                onClick={() => setActive("all")}
                label={`الكل (${catalogProducts.length})`}
              />
              {catalogCategories.map((cat) => (
                <Chip
                  key={cat.id}
                  active={active === cat.id}
                  onClick={() => setActive(cat.id)}
                  label={`${cat.title} (${counts[cat.id]})`}
                />
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            لا توجد نتائج مطابقة لبحثك في هذا القسم.
          </div>
        ) : active === "all" && !query.trim() ? (
          <div className="space-y-16 sm:space-y-20">
            {catalogCategories.map((cat) => {
              const items = catalogProducts.filter((p) => p.category === cat.id);
              if (!items.length) return null;
              return (
                <CategoryBlock
                  key={cat.id}
                  title={cat.title}
                  subtitle={cat.subtitle}
                  items={items}
                  onPreview={setPreview}
                  onRequestForm={openRequestForm}
                />
              );
            })}
          </div>
        ) : (
          <CategoryBlock
            title={
              active === "all"
                ? "نتائج البحث"
                : catalogCategories.find((c) => c.id === active)?.title || ""
            }
            subtitle={
              active === "all"
                ? `${filtered.length} منتج`
                : catalogCategories.find((c) => c.id === active)?.subtitle || ""
            }
            items={filtered}
            onPreview={setPreview}
            onRequestForm={openRequestForm}
          />
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-[80] bg-[#0A182D]/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label="معاينة المنتج"
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-auto rounded-3xl bg-[#F7F8FA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-3 left-3 z-10 rounded-full bg-white/95 p-2 text-[#0A182D] shadow"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid md:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[radial-gradient(circle_at_30%_20%,#fff, #eef2f7_70%)] min-h-[280px] md:min-h-[520px] flex items-center justify-center p-6">
                <img
                  src={preview.img}
                  alt={preview.title}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col">
                {preview.brand && (
                  <div className="text-xs font-bold text-[#E66A1F] mb-2">{preview.brand}</div>
                )}
                <h3 className="text-2xl font-black text-[#0A182D] mb-3">{preview.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">{preview.specs}</p>
                <div className="space-y-2">
                  <a
                    href={quoteWhatsApp(preview.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-extrabold"
                  >
                    طلب تسعيرة واتساب
                    <ArrowLeft size={16} className="mr-2" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openRequestForm(preview.formValue)}
                    className="inline-flex items-center justify-center w-full px-4 py-3 border border-[#F4B41A] text-[#0A182D] rounded-xl font-extrabold hover:bg-[#F4B41A]"
                  >
                    طلب عبر النموذج
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 sm:px-4 py-2 text-[11px] sm:text-sm font-bold border transition-all ${
        active
          ? "bg-[#0E2A47] text-white border-[#0E2A47] shadow-sm"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#F4B41A] hover:text-[#0A182D]"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryBlock({
  title,
  subtitle,
  items,
  onPreview,
  onRequestForm,
}: {
  title: string;
  subtitle: string;
  items: CatalogProduct[];
  onPreview: (p: CatalogProduct) => void;
  onRequestForm: (formValue: string) => void;
}) {
  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="font-brand text-xl sm:text-2xl font-black text-[#0A182D]">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-xs font-bold text-slate-400">{items.length} منتج</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {items.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col rounded-[1.35rem] border border-slate-200/90 bg-white overflow-hidden shadow-[0_18px_50px_-34px_rgba(14,42,71,0.55)] hover:-translate-y-0.5 hover:border-[#F4B41A]/60 hover:shadow-[0_24px_60px_-30px_rgba(14,42,71,0.55)] transition-all duration-300"
          >
            <button
              type="button"
              onClick={() => onPreview(product)}
              className="relative aspect-[4/3] overflow-hidden bg-[#EEF1F5] focus:outline-none"
              aria-label={`عرض ${product.title}`}
            >
              <img
                src={product.img}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-[#F4B41A] text-[#0A182D] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                جملة
              </span>
              {product.brand && (
                <span className="absolute top-3 left-3 max-w-[46%] truncate bg-white/95 text-[#0A182D] text-[10px] font-bold px-2 py-1 rounded-md border border-slate-100">
                  {product.brand}
                </span>
              )}
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#0E2A47]/90 text-white text-[10px] font-bold px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-3 w-3" />
                عرض كامل
              </span>
            </button>

            <div className="flex flex-col flex-1 p-4 sm:p-5 border-t border-slate-100">
              <h4 className="text-[15px] sm:text-base font-black text-[#0A182D] leading-snug mb-2 min-h-[2.6em]">
                {product.title}
              </h4>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-5 flex-1">
                {product.specs}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <a
                  href={quoteWhatsApp(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl font-bold text-sm"
                >
                  طلب تسعيرة واتساب
                  <ArrowLeft size={15} className="mr-2" />
                </a>
                <button
                  type="button"
                  onClick={() => onRequestForm(product.formValue)}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-[#F4B41A]/80 text-[#0A182D] rounded-xl font-bold text-sm hover:bg-[#F4B41A]"
                >
                  طلب عبر النموذج
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
