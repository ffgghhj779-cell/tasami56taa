import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Menu, ShoppingCart, X } from "lucide-react";
import QuoteRequestForm from "@/src/components/QuoteRequestForm";
import LanguageSwitch from "@/src/components/LanguageSwitch";
import { useCart } from "@/src/hooks/useCart";
import { useLocale } from "@/src/hooks/useLocale";

const WHATSAPP_URL = "https://wa.me/966550266838";

type Props = {
  title: string;
  description: string;
  heading?: string;
  lead?: string;
  whatsappText?: string;
  /** Full-width page: children own the whole layout between header and footer. */
  bare?: boolean;
  children: ReactNode;
};

export default function SiteFrame({
  title,
  description,
  heading,
  lead,
  whatsappText = "",
  bare = false,
  children,
}: Props) {
  const { count: cartCount } = useCart();
  const { t, localizePath, dir } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const BackIcon = dir === "ltr" ? ArrowRight : ArrowLeft;

  const links = useMemo(
    () => [
      { label: t.nav.home, href: localizePath("/") },
      { label: t.nav.about, href: localizePath("/about") },
      { label: t.nav.products, href: `${localizePath("/")}#products` },
      { label: t.nav.restaurants, href: localizePath("/restaurants") },
      { label: t.nav.markets, href: localizePath("/markets") },
      { label: t.nav.delivery, href: localizePath("/delivery") },
      { label: t.nav.contact, href: `${localizePath("/")}#contact` },
    ],
    [t, localizePath],
  );

  useEffect(() => {
    const previous = document.title;
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", description);
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
    };
  }, [title, description]);

  return (
    <div className="font-sans text-slate-800 bg-white min-h-screen">
      <nav className="bg-[#0E2A47] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-12 h-14 md:h-20 flex items-center justify-between gap-3">
          <Link
            to={localizePath("/")}
            className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
            aria-label={t.nav.homeAria}
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              decoding="async"
              className="h-9 sm:h-11 w-auto object-contain"
            />
            <span className="font-brand text-[14px] sm:text-xl md:text-2xl font-black leading-tight text-white whitespace-nowrap">
              {t.brand.name} <span className="text-[#2A7A42]">{t.brand.accent}</span>
            </span>
          </Link>
          <div className="hidden lg:flex whitespace-nowrap items-center justify-end gap-x-4 xl:gap-6 text-sm font-bold text-white">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-[#F4B41A] transition-colors">
                {link.label}
              </Link>
            ))}
            <LanguageSwitch />
            <Link
              to={localizePath("/cart")}
              className="relative inline-flex items-center gap-1.5 hover:text-[#F4B41A] transition-colors"
              aria-label={t.nav.cartAria}
            >
              <ShoppingCart className="h-4 w-4" />
              {t.nav.cart}
              {cartCount > 0 && (
                <span className="absolute -top-2 -end-3 min-w-5 h-5 px-1 rounded-full bg-[#F4B41A] text-[#0A182D] text-[10px] font-extrabold grid place-items-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
          <div className="lg:hidden flex items-center gap-1.5">
            <LanguageSwitch />
            <Link
              to={localizePath("/cart")}
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white touch-manipulation"
              aria-label={t.nav.cartAria}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-[#F4B41A] text-[#0A182D] text-[9px] font-extrabold grid place-items-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white touch-manipulation active:bg-white/15"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0E2A47] px-3.5 pb-4 pt-2 shadow-xl">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-bold text-white/90 active:bg-white/10 touch-manipulation"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {bare ? (
        <main>{children}</main>
      ) : (
        <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
          <p className="text-[#E66A1F] text-xs font-bold tracking-[0.16em] mb-3">{t.siteFrame.eyebrow}</p>
          <h1 className="text-[1.85rem] sm:text-5xl font-black text-[#0A182D] leading-tight mb-4 sm:mb-5">{heading}</h1>
          <p className="text-[15px] sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-3xl">{lead}</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12">
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#15803D] text-white px-6 py-3.5 rounded-md font-bold"
            >
              {t.siteFrame.whatsappCta}
              <BackIcon className="ms-2 h-4 w-4" />
            </a>
            <Link
              to={`${localizePath("/")}#products`}
              className="inline-flex items-center justify-center border border-[#0E2A47] text-[#0E2A47] px-6 py-3.5 rounded-md font-bold"
            >
              {t.siteFrame.browseProducts}
            </Link>
          </div>
          {children}
          <div className="mt-14">
            <QuoteRequestForm />
          </div>
        </main>
      )}

      <footer className="bg-[#0A182D] text-white/70 px-4 sm:px-6 lg:px-12 py-10 text-sm leading-relaxed">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-white font-bold mb-2">{t.siteFrame.footerName}</p>
          <p>{t.siteFrame.footerAddress}</p>
          <p>{t.siteFrame.footerPostal}</p>
          <p>{t.siteFrame.footerCr}</p>
          <p className="mt-3" dir="ltr">
            <a href="tel:0550266838" className="hover:text-white">
              055 026 6838
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}