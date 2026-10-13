import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import QuoteRequestForm from "@/src/components/QuoteRequestForm";

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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-brand text-lg sm:text-2xl font-black text-white">
            تسامي <span className="text-[#2A7A42]">الوطنية</span>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm font-bold text-white">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className="hover:text-[#F4B41A]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <p className="text-[#E66A1F] text-xs font-bold tracking-[0.16em] mb-3">مؤسسة تسامي الوطنية</p>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A182D] leading-tight mb-5">{heading}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-3xl">{lead}</p>
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
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
