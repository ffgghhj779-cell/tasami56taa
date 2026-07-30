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
      className="relative scroll-mt-16 md:scroll-mt-28 py-12 sm:py-24 md:py-28 bg-[linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_28%,#FFFFFF_100%)] border-t border-slate-100"
    >
      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div className="max-w-3xl">
            <div className="text-[#E66A1F] text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase mb-2 sm:mb-3">
              كتالوج التوريد الفاخر
            </div>
            <h2 className="font-brand text-[1.65rem] leading-[1.2] sm:text-4xl lg:text-[3.4rem] font-black text-[#0A182D] tracking-tight mb-2.5 sm:mb-4">
              أقسام المنتجات بالجملة
            </h2>
            <p className="text-slate-500 text-[13px] sm:text-lg leading-relaxed">
              {catalogProducts.length} صنفاً من صور المنتجات الفعلية — مواصفات دقيقة وطلب تسعيرة فوري.
            </p>
          </div>

          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو الماركة..."
              className="w-full rounded-2xl border border-slate-200 bg-white pr-10 pl-4 py-3 text-sm text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/35 focus:border-[#F4B41A] shadow-sm"
            />
          </div>
        </div>

        <div className="sticky top-14 md:top-24 z-30 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 mb-7 sm:mb-10">
          <div className="relative rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_10px_40px_-24px_rgba(14,42,71,0.5)] p-1.5 sm:p-3">
            <div className="catalog-chip-scroll flex gap-1.5 sm:gap-2 overflow-x-auto overscroll-x-contain pb-0.5 snap-x snap-mandatory">
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
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 sm:p-12 text-center text-slate-500 text-sm">
            لا توجد نتائج مطابقة لبحثك في هذا القسم.
          </div>
        ) : active === "all" && !query.trim() ? (
          <div className="space-y-10 sm:space-y-20">
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
          className="fixed inset-0 z-[80] bg-[#0A182D]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label="معاينة المنتج"
        >
          <div
            className="relative w-full sm:max-w-4xl max-h-[92svh] overflow-auto rounded-t-[1.75rem] sm:rounded-3xl bg-[#F7F8FA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-3 left-3 z-10 rounded-full bg-white/95 p-2.5 text-[#0A182D] shadow touch-manipulation"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid md:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-[radial-gradient(circle_at_30%_20%,#fff,#eef2f7_70%)] min-h-[240px] sm:min-h-[280px] md:min-h-[520px] flex items-center justify-center p-4 sm:p-6">
                <img
                  src={preview.img}
                  alt={preview.title}
                  className="max-h-[42svh] sm:max-h-[70vh] w-full object-contain"
                />
              </div>
              <div className="p-5 sm:p-8 flex flex-col pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {preview.brand && (
                  <div className="text-xs font-bold text-[#E66A1F] mb-2">{preview.brand}</div>
                )}
                <h3 className="text-xl sm:text-2xl font-black text-[#0A182D] mb-2 sm:mb-3">
                  {preview.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 flex-1">
                  {preview.specs}
                </p>
                <div className="space-y-2">
                  <a
                    href={quoteWhatsApp(preview.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full min-h-12 px-4 py-3 bg-[#16A34A] active:bg-[#15803D] text-white rounded-xl font-extrabold touch-manipulation"
                  >
                    طلب تسعيرة واتساب
                    <ArrowLeft size={16} className="mr-2" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openRequestForm(preview.formValue)}
                    className="inline-flex items-center justify-center w-full min-h-12 px-4 py-3 border border-[#F4B41A] text-[#0A182D] rounded-xl font-extrabold active:bg-[#F4B41A] touch-manipulation"
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
      className={`shrink-0 snap-start rounded-full px-3 sm:px-4 py-2 min-h-9 text-[11px] sm:text-sm font-bold border transition-all touch-manipulation ${
        active
          ? "bg-[#0E2A47] text-white border-[#0E2A47] shadow-sm"
          : "bg-slate-50 text-slate-600 border-slate-200 active:border-[#F4B41A] active:text-[#0A182D]"
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
      <div className="mb-4 sm:mb-8 flex flex-wrap items-end justify-between gap-2 border-b border-slate-200/80 pb-3 sm:pb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-brand text-lg sm:text-2xl font-black text-[#0A182D] leading-snug">
            {title}
          </h3>
          <p className="text-[12px] sm:text-sm text-slate-500 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="text-[11px] sm:text-xs font-bold text-slate-400 shrink-0">
          {items.length} منتج
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
        {items.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col rounded-[1.1rem] sm:rounded-[1.35rem] border border-slate-200/90 bg-white overflow-hidden shadow-[0_12px_36px_-28px_rgba(14,42,71,0.55)] sm:shadow-[0_18px_50px_-34px_rgba(14,42,71,0.55)] active:border-[#F4B41A]/70 sm:hover:-translate-y-0.5 sm:hover:border-[#F4B41A]/60 transition-all duration-300"
          >
            <button
              type="button"
              onClick={() => onPreview(product)}
              className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-[#EEF1F5] focus:outline-none touch-manipulation"
              aria-label={`عرض ${product.title}`}
            >
              <img
                src={product.img}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#F4B41A] text-[#0A182D] text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-sm">
                جملة
              </span>
              {product.brand && (
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 max-w-[48%] truncate bg-white/95 text-[#0A182D] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-100">
                  {product.brand}
                </span>
              )}
              <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 inline-flex items-center justify-center rounded-full bg-[#0E2A47]/88 text-white p-1.5 sm:gap-1 sm:px-2.5 sm:py-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-3 w-3" />
                <span className="hidden sm:inline text-[10px] font-bold">عرض</span>
              </span>
            </button>

            <div className="flex flex-col flex-1 p-2.5 sm:p-5 border-t border-slate-100">
              <h4 className="text-[12px] sm:text-base font-black text-[#0A182D] leading-snug mb-1 sm:mb-2 line-clamp-2 min-h-[2.4em]">
                {product.title}
              </h4>
              <p className="text-slate-500 text-[10px] sm:text-[13px] leading-relaxed mb-2.5 sm:mb-5 line-clamp-2 sm:line-clamp-none flex-1">
                {product.specs}
              </p>
              <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
                <a
                  href={quoteWhatsApp(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full min-h-9 sm:min-h-10 px-2 sm:px-4 py-2 sm:py-2.5 bg-[#16A34A] active:bg-[#15803D] sm:hover:bg-[#15803D] text-white rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm touch-manipulation"
                >
                  <span className="sm:hidden">واتساب</span>
                  <span className="hidden sm:inline">طلب تسعيرة واتساب</span>
                  <ArrowLeft size={13} className="mr-1 sm:mr-2 hidden sm:block" />
                </a>
                <button
                  type="button"
                  onClick={() => onRequestForm(product.formValue)}
                  className="inline-flex items-center justify-center w-full min-h-9 sm:min-h-10 px-2 sm:px-4 py-2 sm:py-2.5 border border-[#F4B41A]/80 text-[#0A182D] rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-sm active:bg-[#F4B41A] sm:hover:bg-[#F4B41A] touch-manipulation"
                >
                  <span className="sm:hidden">النموذج</span>
                  <span className="hidden sm:inline">طلب عبر النموذج</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
