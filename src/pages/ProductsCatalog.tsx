import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
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

function scrollToContact(formValue: string) {
  const select = document.getElementById("product") as HTMLSelectElement | null;
  if (select) select.value = formValue;
  const el = document.getElementById("contact");
  if (!el) return;
  const header = document.querySelector("nav");
  const offset = header instanceof HTMLElement ? header.offsetHeight + 8 : 96;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  history.replaceState(null, "", "#contact");
}

export default function ProductsCatalog() {
  const [active, setActive] = useState<CatalogCategoryId | "all">("all");

  const visible = useMemo(() => {
    if (active === "all") return catalogProducts;
    return catalogProducts.filter((p) => p.category === active);
  }, [active]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(
      catalogCategories.map((c) => [c.id, 0]),
    ) as Record<CatalogCategoryId, number>;
    for (const p of catalogProducts) map[p.category] += 1;
    return map;
  }, []);

  return (
    <section id="products" className="py-14 sm:py-20 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            • كتالوج التوريد
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black text-[#0A182D] leading-[1.15] tracking-tight mb-4">
            أقسام المنتجات بالجملة
          </h2>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
            أكثر من {catalogProducts.length} صنفاً مصنّفاً بدقة من صور المنتجات الفعلية —
            اختر القسم ثم اطلب التسعيرة مباشرة.
          </p>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
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

        {active === "all" ? (
          <div className="space-y-16">
            {catalogCategories.map((cat) => {
              const items = catalogProducts.filter((p) => p.category === cat.id);
              if (!items.length) return null;
              return (
                <CategoryBlock key={cat.id} title={cat.title} subtitle={cat.subtitle} items={items} />
              );
            })}
          </div>
        ) : (
          <CategoryBlock
            title={catalogCategories.find((c) => c.id === active)?.title || ""}
            subtitle={catalogCategories.find((c) => c.id === active)?.subtitle || ""}
            items={visible}
          />
        )}
      </div>
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
      className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold border transition-colors ${
        active
          ? "bg-[#0E2A47] text-white border-[#0E2A47]"
          : "bg-white text-slate-600 border-slate-200 hover:border-[#F4B41A]"
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
}: {
  title: string;
  subtitle: string;
  items: CatalogProduct[];
}) {
  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-black text-[#0A182D]">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {items.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-[0_12px_40px_-28px_rgba(14,42,71,0.35)] hover:border-[#F4B41A]/50 transition-colors"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                src={product.img}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A182D]/45 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 bg-[#F4B41A] text-[#0A182D] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                جملة
              </span>
              {product.brand && (
                <span className="absolute bottom-3 right-3 bg-white/90 text-[#0A182D] text-[10px] font-bold px-2 py-1 rounded-md">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-1 p-4 sm:p-5">
              <h4 className="text-base sm:text-lg font-black text-[#0A182D] leading-snug mb-2">
                {product.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">
                {product.specs}
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <a
                  href={quoteWhatsApp(product.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg font-bold text-sm"
                >
                  طلب تسعيرة واتساب
                  <ArrowLeft size={15} className="mr-2" />
                </a>
                <button
                  type="button"
                  onClick={() => scrollToContact(product.formValue)}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-[#F4B41A] text-[#0A182D] rounded-lg font-bold text-sm hover:bg-[#F4B41A]"
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
