import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  Mail,
  Menu,
  X,
  Award,
  BadgeDollarSign,
  Snowflake,
  Headphones,
  Package,
  FileText,
  ClipboardCheck,
  Truck,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "قائمة التوريد", href: "#products" },
  { label: "اطلب الجملة", href: "#contact" },
];

const stats = [
  { value: "10+", label: "سنوات خبرة", full: "10+ سنوات خبرة" },
  { value: "500+", label: "عميل راضي", full: "500+ عميل راضي" },
  { value: "100%", label: "جودة مضمونة", full: "100% جودة مضمونة" },
  { value: "24/7", label: "توصيل سريع", full: "توصيل سريع 24/7" },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "شهادات الجودة",
    desc: "منتجات معتمدة ومطابقة لاشتراطات هيئة الغذاء والدواء ومعايير السلامة الغذائية.",
  },
  {
    icon: BadgeDollarSign,
    title: "أسعار تنافسية",
    desc: "أسعار جملة مدروسة تضمن أفضل هوامش الربح لمطعمك أو سوقك المركزي.",
  },
  {
    icon: Snowflake,
    title: "سلاسل إمداد مبردة",
    desc: "نقل وتخزين مبرد يحافظ على طزاجة وجودة المنتجات حتى باب منشأتك.",
  },
  {
    icon: Headphones,
    title: "دعم مخصص",
    desc: "فريق مبيعات متخصص لخدمة عملاء الجملة والمتابعة السريعة لكل طلب.",
  },
];

const products = [
  {
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80",
    title: "دواجن مبردة",
    price: "كميات تبدأ من 10 كرتون",
    badge: "جملة",
  },
  {
    img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=80",
    title: "دواجن فريش",
    price: "كميات تبدأ من 10 كرتون",
    badge: "جملة",
  },
  {
    img: "https://images.unsplash.com/photo-1518013431117-eb94217b7943?auto=format&fit=crop&w=900&q=80",
    title: "بطاطس شرائح (مجمدة)",
    price: "كميات تبدأ من 20 كيس",
    badge: "جملة",
  },
  {
    img: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80",
    title: "بيض طازج (مزارع)",
    price: "كميات تبدأ من 50 كرتونة",
    badge: "جملة",
  },
];

const processSteps = [
  {
    num: "01",
    title: "تقديم الطلب",
    desc: "املأ نموذج التوريد أو تواصل معنا مباشرةً بمواصفات واحتياجات منشأتك.",
    icon: FileText,
  },
  {
    num: "02",
    title: "عرض السعر",
    desc: "يصلك عرض سعر الجملة وأوقات التوصيل بسرعة وشفافية كاملة.",
    icon: ClipboardCheck,
  },
  {
    num: "03",
    title: "التجهيز والجودة",
    desc: "فرز وتعبئة المنتجات وفق أعلى معايير الجودة والسلامة الغذائية.",
    icon: Package,
  },
  {
    num: "04",
    title: "التوصيل السريع",
    desc: "توصيل عبر سلاسل إمداد مبردة مباشرة إلى مطعمك أو مستودعك.",
    icon: Truck,
  },
];

const productOptions = [
  "دواجن مبردة",
  "دواجن فريش",
  "بطاطس شرائح مجمدة",
  "بيض طازج",
  "جميع المنتجات (توريد شامل)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setFormStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xjkyzzbq", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#1A365D] overflow-x-hidden">
      {/* ═══════════════════════════════════════
          Section 1: Top Bar & Sticky Navbar
      ═══════════════════════════════════════ */}

      {/* Top Bar */}
      <div className="bg-[#1A365D] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Right (start in RTL): contact */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center sm:justify-start">
            <a
              href="tel:0550266838"
              className="inline-flex items-center gap-1.5 hover:text-[#F4B41A] transition-colors"
              dir="ltr"
            >
              <Phone size={14} className="shrink-0" />
              <span>055 026 6838</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <a
              href="mailto:tasamiest@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-[#F4B41A] transition-colors"
            >
              <Mail size={14} className="shrink-0" />
              <span>tasamiest@gmail.com</span>
            </a>
          </div>
          {/* Left (end in RTL): tagline */}
          <p className="text-center sm:text-left text-white/90 font-light text-xs sm:text-sm">
            توريدات جملة للمطاعم والأسواق المركزية
          </p>
        </div>
      </div>

      {/* Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_4px_24px_rgba(15,36,66,0.10)]"
            : "shadow-[0_2px_12px_rgba(15,36,66,0.06)]"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] md:h-20">
            {/* Logo */}
            <a href="#home" className="flex flex-col group">
              <span className="text-xl sm:text-2xl font-extrabold text-[#2A7A42] leading-tight tracking-tight group-hover:opacity-90 transition-opacity">
                تسامي الوطنية
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#E66A1F] leading-tight">
                توريدات الجملة
              </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#1A365D] font-bold text-sm hover:text-[#E66A1F] transition-colors relative after:absolute after:bottom-[-4px] after:right-0 after:h-0.5 after:w-0 after:bg-[#E66A1F] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden sm:inline-flex items-center justify-center bg-[#E66A1F] hover:bg-[#1A365D] text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-[0_4px_14px_rgba(230,106,31,0.35)] hover:shadow-[0_6px_20px_rgba(26,54,93,0.35)] hover:scale-[1.03] transition-all duration-300"
              >
                تواصل للموزعين
              </a>
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1A365D] hover:bg-[#F5F5F7] transition-colors"
                aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                onClick={() => setIsMobileMenuOpen((v) => !v)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="md:hidden overflow-hidden border-t border-[#E9D8C0]/60 bg-white shadow-[0_12px_32px_rgba(15,36,66,0.08)]"
            >
              <div className="flex flex-col px-4 py-5 gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg font-bold text-[#1A365D] hover:bg-[#F5F5F7] hover:text-[#E66A1F] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 mx-4 inline-flex items-center justify-center bg-[#E66A1F] hover:bg-[#1A365D] text-white px-5 py-3 rounded-lg font-bold text-sm transition-all"
                >
                  تواصل للموزعين
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════
          Section 2: Premium Hero
      ═══════════════════════════════════════ */}
      <section
        id="home"
        className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80"
            alt="توريدات ولوجستيات الجملة"
            className="w-full h-full object-cover"
          />
          {/* Premium dark / gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#0F2442]/92 via-[#1A365D]/78 to-[#0F2442]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F2442]/70 via-transparent to-[#0F2442]/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-block mb-6 text-[#F4B41A] font-bold text-sm tracking-wide"
            >
              مؤسسة تسامي الوطنية للتوريدات
            </motion.span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-8 drop-shadow-lg">
              توريدات جملة للمطاعم والأسواق المركزية
            </h1>

            <p className="text-lg sm:text-xl text-white/85 font-light leading-relaxed mb-10 max-w-2xl">
              شريكك الموثوق لتوريد الدواجن، البطاطس المجمدة، والبيض الطازج —
              بجودة مضمونة وأسعار جملة تنافسية وتوصيل مبرد سريع.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#E66A1F] hover:bg-[#d45e18] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg shadow-[0_8px_28px_rgba(230,106,31,0.45)] hover:shadow-[0_12px_36px_rgba(230,106,31,0.55)] hover:scale-[1.03] transition-all duration-300"
              >
                طلب عرض سعر
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white/80 hover:border-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg backdrop-blur-sm hover:scale-[1.03] transition-all duration-300"
              >
                عرض المنتجات
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Section 3: Trust & Stats Bar
      ═══════════════════════════════════════ */}
      <section className="relative z-20 -mt-12 md:-mt-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="max-w-7xl mx-auto bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,36,66,0.12)] border border-[#E9D8C0]/40 overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#E9D8C0]/50">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.full}
                custom={idx}
                variants={fadeUp}
                className="flex flex-col items-center justify-center text-center px-4 py-8 md:py-10 group hover:bg-[#F5F5F7]/60 transition-colors"
                title={stat.full}
              >
                <span
                  className="text-3xl md:text-4xl font-extrabold text-[#E66A1F] mb-2 group-hover:scale-110 transition-transform duration-300"
                  dir="ltr"
                >
                  {stat.value}
                </span>
                <span className="text-sm md:text-base font-bold text-[#1A365D]">
                  {stat.label}
                </span>
                <span className="sr-only">{stat.full}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          Section 4: Why Choose Us
      ═══════════════════════════════════════ */}
      <section id="why-us" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14 md:mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[#1A365D] tracking-tight"
            >
              لماذا تختار تسامي الوطنية؟
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="mt-4 mx-auto w-16 h-1 rounded-full bg-[#E66A1F]"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={idx}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="bg-white rounded-2xl p-8 text-center shadow-[0_4px_24px_rgba(15,36,66,0.06)] border border-[#E9D8C0]/50 hover:shadow-[0_12px_40px_rgba(15,36,66,0.12)] hover:border-[#E66A1F]/30 transition-shadow duration-300"
              >
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1A365D] to-[#0F2442] flex items-center justify-center shadow-[0_8px_24px_rgba(26,54,93,0.25)]">
                  <item.icon size={28} className="text-[#F4B41A]" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-extrabold text-[#1A365D] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#1A365D]/70 leading-relaxed font-light">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Section 5: Wholesale Products Grid
      ═══════════════════════════════════════ */}
      <section id="products" className="py-20 md:py-28 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14 md:mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[#1A365D] tracking-tight"
            >
              🏭 قائمة منتجات التوريد (الجملة)
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="mt-4 mx-auto w-16 h-1 rounded-full bg-[#E66A1F]"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {products.map((product, idx) => (
              <motion.article
                key={product.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={idx}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="bg-[#E9D8C0] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,36,66,0.08)] hover:shadow-[0_16px_48px_rgba(15,36,66,0.16)] transition-shadow duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2442]/55 via-[#0F2442]/10 to-transparent" />
                  <span className="absolute top-4 right-4 bg-[#F4B41A] text-[#0F2442] text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-extrabold text-[#1A365D] mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm font-bold text-[#E66A1F] mb-6">
                    {product.price}
                  </p>
                  <a
                    href="#contact"
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-[#1A365D] hover:bg-[#E66A1F] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(26,54,93,0.25)] hover:shadow-[0_6px_20px_rgba(230,106,31,0.4)] transition-all duration-300"
                  >
                    📦 طلب توريد الجملة
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Section 6: Supply Process
      ═══════════════════════════════════════ */}
      <section id="process" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14 md:mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[#1A365D] tracking-tight"
            >
              خطوات التوريد والتوصيل
            </motion.h2>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="mt-4 mx-auto w-16 h-1 rounded-full bg-[#E66A1F]"
            />
          </motion.div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-12 right-[12.5%] left-[12.5%] h-0.5 bg-gradient-to-l from-[#E66A1F] via-[#F4B41A] to-[#E66A1F] opacity-30" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {processSteps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={idx}
                  variants={fadeUp}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-[#1A365D] to-[#0F2442] flex flex-col items-center justify-center shadow-[0_8px_28px_rgba(26,54,93,0.3)] hover:shadow-[0_0_28px_rgba(230,106,31,0.35)] hover:scale-105 transition-all duration-300">
                    <span className="text-[#F4B41A] text-xs font-bold tracking-wider" dir="ltr">
                      {step.num}
                    </span>
                    <step.icon size={22} className="text-white mt-1" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A365D] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#1A365D]/65 leading-relaxed font-light max-w-[220px]">
                    {step.desc}
                  </p>
                  {idx < processSteps.length - 1 && (
                    <span className="sm:hidden mt-6 text-[#E66A1F] font-bold text-xl" aria-hidden>
                      ↓
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Section 7: Contact & Supply Request Form
      ═══════════════════════════════════════ */}
      <section id="contact" className="py-20 md:py-28 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-12 md:mb-14"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[#1A365D] tracking-tight"
            >
              📝 قدم طلب توريد الآن
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mt-5 text-base sm:text-lg text-[#1A365D]/70 font-light leading-relaxed max-w-2xl mx-auto"
            >
              هل تدير مطعم، سوق مركزي، أو سلسلة تجارية؟ املأ النموذج وسيصلك عرض
              السعر الجملة وأوقات التوصيل خلال ساعة.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="mt-4 mx-auto w-16 h-1 rounded-full bg-[#E66A1F]"
            />
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Info Box */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="lg:col-span-4"
            >
              <div className="bg-[#1A365D] rounded-2xl p-8 md:p-10 text-white shadow-[0_12px_40px_rgba(26,54,93,0.3)] sticky top-28">
                <h3 className="text-xl font-extrabold mb-3 text-[#F4B41A]">
                  تواصل مباشر
                </h3>
                <p className="text-white/75 font-light text-sm leading-relaxed mb-8">
                  فريق المبيعات جاهز لمساعدتك في عروض الأسعار وكميات الجملة
                  وجداول التوصيل.
                </p>

                <div className="space-y-5">
                  <a
                    href="tel:0550266838"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group"
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#E66A1F] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <Phone size={20} />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">الجوال</div>
                      <div className="font-bold text-lg" dir="ltr">
                        📞 055 026 6838
                      </div>
                    </div>
                  </a>

                  <a
                    href="mailto:tasamiest@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors group"
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#E66A1F] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                      <Mail size={20} />
                    </span>
                    <div>
                      <div className="text-xs text-white/60 mb-0.5">البريد</div>
                      <div className="font-bold text-base break-all">
                        ✉️ tasamiest@gmail.com
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="lg:col-span-8"
            >
              <form
                action="https://formspree.io/f/xjkyzzbq"
                method="POST"
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_8px_32px_rgba(15,36,66,0.08)] border border-[#E9D8C0]/40 space-y-5"
              >
                {/* 1. Business name */}
                <div>
                  <label
                    htmlFor="business"
                    className="block text-sm font-bold text-[#1A365D] mb-2"
                  >
                    اسم المؤسسة أو المطعم
                  </label>
                  <input
                    id="business"
                    name="business"
                    type="text"
                    required
                    placeholder="مثال: مطعم الياسمين"
                    className="w-full rounded-xl border border-[#E9D8C0] bg-[#F5F5F7]/50 px-4 py-3.5 text-[#1A365D] placeholder:text-[#1A365D]/35 focus:outline-none focus:ring-2 focus:ring-[#E66A1F]/40 focus:border-[#E66A1F] transition-all"
                  />
                </div>

                {/* 2. Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold text-[#1A365D] mb-2"
                  >
                    رقم الجوال (مهم للتواصل السريع)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="05XXXXXXXX"
                    className="w-full rounded-xl border border-[#E9D8C0] bg-[#F5F5F7]/50 px-4 py-3.5 text-[#1A365D] placeholder:text-[#1A365D]/35 focus:outline-none focus:ring-2 focus:ring-[#E66A1F]/40 focus:border-[#E66A1F] transition-all"
                  />
                </div>

                {/* 3. City / Region */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-bold text-[#1A365D] mb-2"
                  >
                    المدينة / المنطقة الجغرافية
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="مثال: الرياض — حي النرجس"
                    className="w-full rounded-xl border border-[#E9D8C0] bg-[#F5F5F7]/50 px-4 py-3.5 text-[#1A365D] placeholder:text-[#1A365D]/35 focus:outline-none focus:ring-2 focus:ring-[#E66A1F]/40 focus:border-[#E66A1F] transition-all"
                  />
                </div>

                {/* 4. Product select */}
                <div>
                  <label
                    htmlFor="product"
                    className="block text-sm font-bold text-[#1A365D] mb-2"
                  >
                    المنتج المطلوب
                  </label>
                  <select
                    id="product"
                    name="product"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-[#E9D8C0] bg-[#F5F5F7]/50 px-4 py-3.5 text-[#1A365D] focus:outline-none focus:ring-2 focus:ring-[#E66A1F]/40 focus:border-[#E66A1F] transition-all appearance-none cursor-pointer"
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

                {/* 5. Quantity textarea */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-bold text-[#1A365D] mb-2"
                  >
                    الكمية المطلوبة
                  </label>
                  <textarea
                    id="quantity"
                    name="quantity"
                    required
                    rows={4}
                    placeholder="الكمية المطلوبة (مثال: 100 كيس بطاطس، 500 كرتون بيض)"
                    className="w-full rounded-xl border border-[#E9D8C0] bg-[#F5F5F7]/50 px-4 py-3.5 text-[#1A365D] placeholder:text-[#1A365D]/35 focus:outline-none focus:ring-2 focus:ring-[#E66A1F]/40 focus:border-[#E66A1F] transition-all resize-y min-h-[120px]"
                  />
                </div>

                {/* Status messages */}
                {formStatus === "success" && (
                  <div className="rounded-xl bg-[#2A7A42]/10 border border-[#2A7A42]/30 text-[#2A7A42] px-4 py-3 text-sm font-bold">
                    تم إرسال طلبك بنجاح. سنتواصل معك قريباً بعرض السعر.
                  </div>
                )}
                {formStatus === "error" && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-bold">
                    حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر
                    الواتساب.
                  </div>
                )}

                {/* 6. Submit */}
                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#E66A1F] hover:bg-[#1A365D] disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg shadow-[0_8px_28px_rgba(230,106,31,0.4)] hover:shadow-[0_8px_28px_rgba(26,54,93,0.35)] hover:scale-[1.01] transition-all duration-300"
                >
                  {formStatus === "sending"
                    ? "جاري الإرسال..."
                    : "🛒 إرسال طلب التوريد (جملة)"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Section 8: Footer & WhatsApp Float
      ═══════════════════════════════════════ */}
      <footer className="bg-[#0F2442] text-white text-center py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2A7A42] block">
              تسامي الوطنية
            </span>
            <span className="text-sm font-bold text-[#E66A1F] mt-1 block">
              توريدات الجملة
            </span>
          </div>
          <p className="text-white/55 text-sm font-light leading-relaxed">
            جميع الحقوق محفوظة © 2026 - مؤسسة تسامي الوطنية للتوريدات
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp — bottom left (physical left) */}
      <a
        href="https://wa.me/966550266838"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-6 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_28px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.65)] hover:scale-110 transition-all duration-300"
      >
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      </a>
    </div>
  );
}
