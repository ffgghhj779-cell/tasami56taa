import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Languages } from "lucide-react";
import { LOCALE_LABELS, LOCALE_MARKETS, LOCALES } from "@/src/lib/i18n/config";
import { useLocale } from "@/src/hooks/useLocale";

export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, switchLocalePath } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const ariaLabel =
    locale === "en"
      ? "Choose language"
      : locale === "ur"
        ? "زبان منتخب کریں"
        : locale === "hi"
          ? "भाषा चुनें"
          : "اختر اللغة";

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-white/15 touch-manipulation"
        onClick={() => setOpen((v) => !v)}
      >
        <Languages className="h-4 w-4 shrink-0 opacity-90" />
        <span>{LOCALE_LABELS[locale]}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-full mt-1.5 min-w-[11.5rem] rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-[60] end-0"
        >
          {LOCALES.map((loc) => (
            <li key={loc} role="option" aria-selected={loc === locale}>
              <Link
                to={switchLocalePath(loc)}
                onClick={() => setOpen(false)}
                className={`flex flex-col gap-0.5 px-3.5 py-2.5 transition-colors ${
                  loc === locale
                    ? "bg-[#0E2A47]/8 text-[#0E2A47]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm font-bold leading-none">{LOCALE_LABELS[loc]}</span>
                <span className="text-[11px] font-medium text-slate-400">{LOCALE_MARKETS[loc]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
