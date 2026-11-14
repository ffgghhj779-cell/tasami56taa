import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Menu, ShoppingCart, X } from "lucide-react";
import QuoteRequestForm from "@/src/components/QuoteRequestForm";
import { useCart } from "@/src/hooks/useCart";

const WHATSAPP_URL = "https://wa.me/966550266838";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/#products" },
  { label: "المطاعم", href: "/restaurants" },
  { label: "الأسواق", href: "/markets" },
  { label: "التوصيل", href: "/delivery" },
  { label: "تواصل", href: "/#contact" },
];

type Props = {
  title: string;
  description: string;
  heading: string;
  lead: string;
  whatsappText: string;
  children: ReactNode;
};

export default function SiteFrame({
  title,
  description,
  heading,
  lead,
  whatsappText,
  children,
}: Props) {
  const { count: cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

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
            to="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0"
            aria-label="تسامي الوطنية — الصفحة الرئيسية"
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
              تسامي <span className="text-[#2A7A42]">الوطنية</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center justify-end gap-x-6 lg:gap-8 text-sm font-bold text-white">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-[#F4B41A] transition-colors">
                {link.label}
              </Link>
            ))}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-1.5 hover:text-[#F4B41A] transition-colors"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart className="h-4 w-4" />
              السلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-3 min-w-5 h-5 px-1 rounded-full bg-[#F4B41A] text-[#0A182D] text-[10px] font-extrabold grid place-items-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-1.5">
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white touch-manipulation"
              aria-label="سلة المشتريات"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 min-w-4 h-4 px-1 rounded-full bg-[#F4B41A] text-[#0A182D] text-[9px] font-extrabold grid place-items-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white touch-manipulation active:bg-white/15"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0E2A47] px-3.5 pb-4 pt-2 shadow-xl">
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

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
        <p className="text-[#E66A1F] text-xs font-bold tracking-[0.16em] mb-3">مؤسسة تسامي الوطنية</p>
        <h1 className="text-[1.85rem] sm:text-5xl font-black text-[#0A182D] leading-tight mb-4 sm:mb-5">{heading}</h1>
        <p className="text-[15px] sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-3xl">{lead}</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-12">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#15803D] text-white px-6 py-3.5 rounded-md font-bold"
          >
            اطلب عرض سعر على واتساب
            <ArrowLeft className="mr-2 h-4 w-4" />
          </a>
          <Link
            to="/#products"
            className="inline-flex items-center justify-center border border-[#0E2A47] text-[#0E2A47] px-6 py-3.5 rounded-md font-bold"
          >
            عرض المنتجات
          </Link>
        </div>
        {children}
        <div className="mt-14">
          <QuoteRequestForm />
        </div>
      </main>

      <footer className="bg-[#0A182D] text-white/70 px-4 sm:px-6 lg:px-12 py-10 text-sm leading-relaxed">
        <div className="max-w-[1100px] mx-auto">
          <p className="text-white font-bold mb-2">مؤسسة تسامي الوطنية</p>
          <p>ينبع، حي الحدائق، شارع الملك عبدالعزيز ابن عبدالرحمن سعود، مبنى 2452</p>
          <p>الرمز البريدي 46429 · العنوان المختصر YADB2452</p>
          <p>السجل التجاري 7051037930 · الرقم الضريبي 314091043600003</p>
          <p className="mt-3" dir="ltr">
            <a href="tel:0550266838" className="hover:text-white">055 026 6838</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
