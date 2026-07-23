import { useState, FormEvent, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ChevronDown,
  ArrowLeft,
  Check,
  ShieldCheck,
  FileText,
  Snowflake,
  Scale,
  Globe,
  Quote,
  Star,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Data — structure mirrors shengdameat.com
───────────────────────────────────────────── */

const stats = [
  { value: "10+", label: "سنوات في توريد الدواجن والأغذية" },
  { value: "500+", label: "عميل راضٍ في أنحاء المملكة" },
  { value: "100%", label: "منتجات معتمدة وعالية الجودة" },
  { value: "24/7", label: "سلاسل إمداد مبردة ولوجستيات" },
];

const certifications = [
  {
    icon: Check,
    title: "حلال Halal",
    desc: "مصانع معتمدة ومطابقة لمواصفات الغذاء والدواء والجهات الإسلامية.",
  },
  {
    icon: ShieldCheck,
    title: "نظام الهاسب HACCP",
    desc: "تحليل المخاطر ونقاط التحكم الحرجة في كل مرحلة إنتاج.",
  },
  {
    icon: FileText,
    title: "أيزو ISO 22000",
    desc: "المعيار العالمي لإدارة سلامة الأغذية.",
  },
  {
    icon: Scale,
    title: "هيئة الغذاء والدواء",
    desc: "امتثال كامل لاشتراطات SFDA في المملكة العربية السعودية.",
  },
  {
    icon: Snowflake,
    title: "سلاسل التبريد",
    desc: "نقل وتخزين في درجة التبريد المناسبة للحفاظ على الجودة.",
  },
];

const miniCards = [
  {
    title: "المهمة",
    desc: "تقديم منتجات غذائية فاخرة بجودة لا تقبل المساومة.",
  },
  {
    title: "التركيز الإقليمي",
    desc: "تغطية شاملة لأكثر من 13 منطقة في المملكة العربية السعودية.",
  },
  {
    title: "الجودة",
    desc: "ضمان الجودة من المصدر إلى المستودع وحتى العميل النهائي.",
  },
  {
    title: "اللوجستيات",
    desc: "سلاسل إمداد مبردة موثوقة من أرض المصدر إلى وجهتك.",
  },
];

const products = [
  {
    img: "/products/chilled-poultry.jpg",
    title: "دواجن مبردة",
    desc: "كميات تبدأ من 10 كرتون. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.",
  },
  {
    img: "/products/fresh-poultry.jpg",
    title: "دواجن فريش",
    desc: "كميات تبدأ من 10 كرتون. طازجة يومياً لتلبية احتياجات المطاعم والأسواق المركزية.",
  },
  {
    img: "/products/fries.jpg",
    title: "بطاطس شرائح (مجمدة)",
    desc: "كميات تبدأ من 20 كيس. بطاطس شرائح جاهزة للقلي تلبي احتياجات قطاع المطاعم.",
  },
  {
    img: "/products/eggs.jpg",
    title: "بيض طازج (مزارع)",
    desc: "كميات تبدأ من 50 كرتونة. بيض مائدة طازج عالي الجودة من مزارع معتمدة.",
  },
  {
    img: "/products/chicken-legs.jpg",
    title: "أفخاذ دجاج كاملة",
    desc: "بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومطابقة لأعلى معايير الجودة.",
  },
  {
    img: "/products/chicken-breast.jpg",
    title: "صدور دجاج بدون عظم",
    desc: "بدون عظم وجلد؛ يسعر بالوزن. منتجة في منشآت تلبي أعلى معايير السلامة الغذائية.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "تقديم الاستفسار",
    desc: "شاركنا المنتج المطلوب، الكميات، والمدينة.",
  },
  {
    num: "02",
    title: "استلام التسعيرة",
    desc: "أسعار تنافسية للجملة خلال ساعة.",
  },
  {
    num: "03",
    title: "الجودة والوثائق",
    desc: "الفحص، الشهادات، وتجهيز الوثائق.",
  },
  {
    num: "04",
    title: "التعبئة والتبريد",
    desc: "تغليف آمن ضمن سلاسل مبردة.",
  },
  {
    num: "05",
    title: "التوصيل السريع",
    desc: "شحن مباشر إلى مستودعاتك أو مطعمك.",
  },
];

const reasons = [
  "منتجات عالية الجودة من أفضل المصادر العالمية والمحلية",
  "أسعار جملة تنافسية تضمن أفضل هوامش الربح",
  "لوجستيات توريد موثوقة ومجدولة بدقة",
  "تغليف مرن وتعبئة مخصصة حسب الطلب",
  "الامتثال الصارم لمعايير الغذاء والدواء (SFDA)",
  "فريق دعم مخصص لخدمة عملاء الجملة والتوريد",
  "توثيق كامل لجميع الشحنات لضمان الشفافية",
  "أسطول مبرد متكامل لتوصيل آمن وسريع",
];

const regions = [
  "الرياض والمنطقة الوسطى",
  "جدة ومكة المكرمة",
  "الدمام والمنطقة الشرقية",
  "تبوك والمنطقة الشمالية",
  "أبها والمنطقة الجنوبية",
  "القصيم وحائل",
];

const testimonials = [
  {
    quote:
      "تسامي الوطنية كانت المورد الأكثر موثوقية لمنتجات الدواجن لدينا طوال السنوات الأربع الماضية. سلاسل التبريد لديهم خالية من العيوب.",
    author: "أحمد المنصوري",
    role: "موزع، الرياض",
  },
  {
    quote:
      "الامتثال لمعايير الحلال، الجودة المتسقة، والأسعار التنافسية — هذا بالضبط ما تتطلبه أسواقنا وعملائنا بشكل دائم.",
    author: "خالد الراشد",
    role: "مستورد، جدة",
  },
  {
    quote:
      "منتجاتهم من الدواجن تلبي باستمرار معايير قطاع التجزئة والخدمات الغذائية لدينا بدقة متناهية.",
    author: "عبدالله السالم",
    role: "مالك مطاعم، الدمام",
  },
];

const faqData = [
  {
    q: "ما هي المنتجات التي تقوم مؤسسة تسامي الوطنية بتوريدها؟",
    a: "نحن متخصصون في توريد الدواجن المبردة والمجمدة، البطاطس المجهزة، والبيض الطازج بكميات الجملة للمطاعم والأسواق المركزية.",
  },
  {
    q: "لماذا نختار تسامي الوطنية كشريك توريد؟",
    a: "لأننا نضمن الجودة العالية، الأسعار التنافسية، وسلاسل الإمداد المبردة الموثوقة التي تضمن وصول المنتجات طازجة وآمنة.",
  },
  {
    q: "هل توفرون منتجات معتمدة بشهادة حلال؟",
    a: "نعم، جميع منتجاتنا معتمدة بشهادة حلال ومطابقة لاشتراطات هيئة الغذاء والدواء في المملكة العربية السعودية.",
  },
  {
    q: "كيف يمكنني طلب تسعيرة لمنتجاتكم؟",
    a: "يمكنك طلب تسعيرة عن طريق تعبئة النموذج في أسفل الصفحة، أو التواصل معنا مباشرة عبر الواتساب أو البريد الإلكتروني.",
  },
  {
    q: "ما هو الوقت المعتاد لتوصيل الطلبات؟",
    a: "يختلف وقت التوصيل بناءً على الكمية والمدينة، ولكننا نتميز بسرعة الاستجابة والتوصيل خلال 24-48 ساعة للطلبات المجدولة.",
  },
];

const productOptions = [
  "دواجن مبردة",
  "دواجن فريش",
  "بطاطس شرائح مجمدة",
  "بيض طازج",
  "جميع المنتجات (توريد شامل)",
];

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "من نحن", href: "#about" },
  { label: "المنتجات", href: "#products" },
  { label: "الأسئلة الشائعة", href: "#faq" },
  { label: "اتصل بنا", href: "#contact" },
];

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const motionOff = !!reduceMotion || isMobile;

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
    <div className="font-sans text-slate-800 bg-white selection:bg-[#F4B41A] selection:text-white overflow-x-hidden">
      {/* ═══ Navbar — Shengda mobile: centered brand + links under ═══ */}
      <nav className="bg-[#0E2A47] w-full z-50 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-3 md:py-0 md:h-24 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-6">
          <a
            href="#home"
            className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B41A]/60 rounded-lg"
            aria-label="تسامي الوطنية — الصفحة الرئيسية"
          >
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              decoding="async"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
            <span className="flex flex-col justify-center md:border-r border-white/15 md:pr-3 min-w-0 text-center md:text-start">
              <span className="font-brand text-[15px] sm:text-xl md:text-2xl font-black leading-tight tracking-tight text-white">
                تسامي <span className="text-[#2A7A42]">الوطنية</span>
              </span>
              <span className="font-brand mt-0.5 text-[9px] sm:text-xs md:text-[13px] font-bold leading-snug text-[#E66A1F]">
                توريدات الجملة للمطاعم والأسواق
              </span>
            </span>
          </a>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2 sm:gap-x-6 md:gap-8 lg:gap-10 font-bold text-white text-[12px] sm:text-sm pb-1 md:pb-0">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors active:opacity-80 touch-manipulation hover:text-[#F4B41A] ${
                  i === 0 ? "text-[#F4B41A]" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══ Hero — centered, dark overlay ═══ */}
      <section
        id="home"
        className="relative min-h-[85vh] md:min-h-[92vh] bg-[#0F2442] flex flex-col justify-center pb-20 md:pb-36"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=70"
            srcSet="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=65 800w, https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=70 1200w, https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=75 2000w"
            sizes="100vw"
            alt="توريدات ولوجستيات الجملة"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-35 md:mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[#0A182D]/60 md:bg-[#0A182D]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A182D]/85 via-transparent to-[#0A182D]/45" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 mt-6 md:mt-10 text-center">
          <motion.div
            initial={motionOff ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionOff ? 0 : 0.55, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[#F4B41A] font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-5 sm:mb-8 flex-wrap px-1">
              <span className="w-5 h-5 rounded-full border border-[#F4B41A] flex items-center justify-center text-[8px] leading-none shrink-0">
                SA
              </span>
              <span>• توريد غذائي معتمد</span>
              <span>• جودة عالية</span>
              <span>• منذ 2014</span>
            </div>

            <h1 className="text-[1.85rem] leading-[1.25] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white tracking-tight mb-5 sm:mb-8 max-w-4xl mx-auto">
              توريدات جملة فاخرة
              <br />
              للمطاعم والأسواق المركزية
            </h1>

            <p className="text-white/80 text-[0.95rem] sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-1">
              نورد الدواجن المبردة والفريش، البطاطس المجمدة، والبيض الطازج —
              بجودة مضمونة وأسعار جملة تنافسية وتوصيل مبرد إلى جميع أنحاء المملكة.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 max-w-md sm:max-w-none mx-auto">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16A34A] active:bg-[#15803D] hover:bg-[#15803D] text-white px-8 py-3.5 sm:py-4 rounded-md font-bold transition-colors text-base sm:text-lg shadow-[0_6px_20px_rgba(22,163,74,0.35)] touch-manipulation"
              >
                طلب عرض سعر
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 active:bg-white/20 hover:bg-white/20 text-white border border-white/25 px-8 py-3.5 sm:py-4 rounded-md font-bold transition-colors text-base sm:text-lg touch-manipulation"
              >
                عرض المنتجات
              </a>
            </div>

            {/* Glass cards — stats + why choose us */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto text-start">
              <div className="glass-card bg-white/10 md:backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-y-6 sm:gap-y-8 gap-x-4 sm:gap-x-6">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <div
                        className="text-2xl sm:text-3xl font-black text-[#F4B41A] mb-1.5 sm:mb-2"
                        dir="ltr"
                      >
                        {stat.value}
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-white/90 leading-relaxed">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card bg-white/10 md:backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-8 shadow-xl flex flex-col justify-center">
                <h3 className="text-[#F4B41A] font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  لماذا تختارنا؟
                </h3>
                <p className="text-white text-[0.95rem] sm:text-lg leading-relaxed font-medium">
                  نحن رواد السوق في توريد الدواجن والأغذية، موثوقون من قبل
                  الموزعين وشركات الخدمات الغذائية في جميع أنحاء المملكة.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Certifications ═══ */}
      <section id="certifications" className="py-14 sm:py-20 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
            • الشهادات والثقة
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-[#0A182D] mb-4 sm:mb-6 tracking-tight">
            مبنية للامتثال للمعايير العالمية
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-16">
            كل شحنة مدعومة بالشهادات، والتتبع، والوثائق الصارمة التي يطلبها
            المشترون وهيئة الغذاء والدواء.
          </p>
          <p className="sm:hidden text-xs font-bold text-[#E66A1F] mb-4 flex items-center justify-center gap-1">
            اسحب للتصفح ←
          </p>

          <div className="sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-6">
            <div className="h-scroll">
              {certifications.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={motionOff ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: motionOff ? 0 : idx * 0.05, duration: motionOff ? 0 : 0.35 }}
                  className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_30px_rgba(10,24,45,0.08)] border border-slate-100 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                    <cert.icon size={24} className="text-[#0A182D]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A182D] mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {cert.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ About Us ═══ */}
      <section id="about" className="py-14 sm:py-20 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
                • عن المؤسسة
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-6 sm:mb-8 leading-[1.1] tracking-tight">
                شريكك الموثوق لتوريد الأغذية
              </h2>

              <div className="relative mt-12 mb-10 lg:mb-0 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=1000&q=75"
                  alt="منشأة سلاسل التبريد"
                  loading="lazy"
                  decoding="async"
                  className="rounded-[2rem] h-[28rem] object-cover w-full shadow-lg"
                />
                <div className="absolute -bottom-8 -left-8 bg-[#0A182D] text-white p-8 rounded-3xl shadow-xl w-56 flex flex-col justify-center items-center text-center">
                  <div
                    className="text-[3.5rem] font-black text-[#F4B41A] leading-none mb-2"
                    dir="ltr"
                  >
                    13+
                  </div>
                  <div className="text-xs font-bold tracking-[0.1em] uppercase text-white/80">
                    منطقة مخدومة
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:pt-4">
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                مؤسسة تسامي الوطنية هي مورد سعودي موثوق يقدم منتجات الدواجن
                والأغذية المجمدة عالية الجودة للمشترين التجاريين في جميع أنحاء
                المملكة العربية السعودية. يمكننا تخصيص المنتجات بمواصفات مختلفة
                لتناسب احتياجات المطاعم والأسواق المركزية.
              </p>

              <p className="sm:hidden text-xs font-bold text-[#E66A1F] mb-3">
                اسحب للتصفح ←
              </p>
              <div className="sm:grid sm:grid-cols-2 sm:gap-6 mb-10 sm:mb-12">
                <div className="h-scroll">
                  {miniCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_30px_rgba(10,24,45,0.08)] border border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-full border border-[#F4B41A]/30 flex items-center justify-center mb-5">
                        <span className="w-2 h-2 rounded-full border-[1.5px] border-[#F4B41A]" />
                      </div>
                      <h4 className="text-lg font-bold text-[#0A182D] mb-3">
                        {card.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-[#0A182D] hover:bg-[#132b52] text-white px-8 py-4 rounded-md font-bold transition-all text-lg hover:scale-[1.02]"
              >
                تحدث مع فريق التوريد
                <ArrowLeft size={20} className="mr-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section id="products" className="py-14 sm:py-20 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
            • المنتجات المميزة
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#0A182D] max-w-3xl leading-[1.1] tracking-tight mb-4 sm:mb-6">
            لمحة عن كتالوج التوريد الخاص بنا
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mb-10 sm:mb-16">
            استكشف المنتجات والأصناف الأكثر طلباً من قبل شركائنا في قطاع
            المطاعم والأسواق المركزية.
          </p>

          <div className="flex justify-between items-center mb-4 sm:mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A182D]">
              أفضل المنتجات مبيعاً
            </h3>
            <a
              href="#contact"
              className="text-sm font-bold text-[#0A182D] hover:text-[#F4B41A] transition-colors inline-flex items-center gap-1"
            >
              عرض الكل <ArrowLeft size={16} />
            </a>
          </div>
          <p className="sm:hidden text-xs font-bold text-[#E66A1F] mb-4">
            اسحب لاستعراض المنتجات ←
          </p>

          <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            <div className="h-scroll h-scroll-wide">
              {products.map((product, idx) => (
                <motion.div
                  key={idx}
                  initial={motionOff ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: motionOff ? 0 : idx * 0.04, duration: motionOff ? 0 : 0.35 }}
                  className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_30px_rgba(10,24,45,0.08)] border border-slate-100 p-4 sm:p-8 flex flex-col group overflow-hidden"
                >
                  <div className="relative rounded-2xl mb-4 sm:mb-6 overflow-hidden h-48 sm:h-56 bg-slate-100">
                    <img
                      src={product.img}
                      alt={product.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover md:group-hover:scale-105 md:transition-transform md:duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A182D]/35 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-[#F4B41A] text-[#0A182D] text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                      جملة
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[#0A182D] mb-2 sm:mb-3">
                    {product.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 sm:mb-8 flex-grow">
                    {product.desc}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center w-full sm:w-max px-6 py-3 border border-[#F4B41A] text-[#0A182D] rounded-md font-bold transition-colors text-sm hover:bg-[#F4B41A] touch-manipulation"
                  >
                    طلب تسعيرة
                    <ArrowLeft size={16} className="mr-2" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Supply Process — dark ═══ */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
            • عملية التوريد
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            من الاستفسار إلى وجهتك النهائية
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mb-6 sm:mb-20">
            عملية مبسطة من خمس خطوات مصممة للمشترين الذين يقدرون السرعة،
            الدقة، والشفافية.
          </p>
          <p className="sm:hidden text-xs font-bold text-[#F4B41A] mb-4">
            اسحب لخطوات التوريد ←
          </p>

          <div className="sm:grid sm:grid-cols-2 md:grid-cols-5 sm:gap-4 lg:gap-6">
            <div className="h-scroll">
              {processSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={motionOff ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: motionOff ? 0 : idx * 0.05, duration: motionOff ? 0 : 0.35 }}
                  className="bg-[#172A46] border border-white/10 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem]"
                >
                  <div
                    className="text-3xl font-black text-[#F4B41A] mb-5"
                    dir="ltr"
                  >
                    {step.num}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Why Choose Us — 8 reasons ═══ */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-24">
            <div className="lg:col-span-5">
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
                • لماذا تختارنا
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-6 sm:mb-8 leading-[1.1] tracking-tight">
                مبنية لشركاء التجارة والأعمال
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                ثمانية أسباب تجعل المشترين من كافة أنحاء المملكة يختارون مؤسسة
                تسامي الوطنية كشريك توريد طويل الأمد لمنتجات الدواجن والأغذية.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-[#0A182D] hover:bg-[#132b52] text-white px-8 py-4 rounded-md font-bold transition-all text-lg"
              >
                تحدث مع فريق المبيعات
                <ArrowLeft size={20} className="mr-3" />
              </a>
            </div>

            <div className="lg:col-span-7">
              <p className="sm:hidden text-xs font-bold text-[#E66A1F] mb-3">
                اسحب للأسباب ←
              </p>
              <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                <div className="h-scroll">
                  {reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-[0_6px_24px_rgba(10,24,45,0.06)]"
                    >
                      <span
                        className="text-[#F4B41A] font-bold text-lg leading-none mt-1"
                        dir="ltr"
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[#0A182D] font-bold text-sm leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Coverage / Markets ═══ */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center mb-10 sm:mb-20">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 flex justify-center">
            • التغطية المحلية
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-white mb-4 sm:mb-6 tracking-tight">
            الشحن لجميع المناطق
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            موثوقون من قبل المستوردين والموزعين وسلاسل السوبر ماركت في الأسواق
            الأكثر تطلباً في المملكة.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-[#172A46] rounded-[2rem] border border-white/5 h-[280px] sm:h-[480px] flex items-center justify-center relative overflow-hidden">
              <Globe
                size={280}
                className="text-white/[0.03] absolute -right-16 -bottom-16 sm:hidden"
              />
              <Globe
                size={400}
                className="text-white/[0.03] absolute -right-20 -bottom-20 hidden sm:block"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#F4B41A] rounded-full blur-[80px] opacity-20" />
                  <div className="w-4 h-4 bg-[#F4B41A] rounded-full relative z-10 shadow-[0_0_20px_rgba(244,180,26,1)]" />
                </div>
              </div>
              <div className="relative z-10 text-center px-8">
                <div
                  className="text-5xl font-black text-[#F4B41A] mb-2"
                  dir="ltr"
                >
                  13+
                </div>
                <div className="text-white/70 font-bold text-sm tracking-widest uppercase">
                  منطقة مخدومة
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 sm:gap-4">
              <div className="h-scroll">
              {regions.map((region, idx) => (
                <div
                  key={idx}
                  className="bg-[#172A46] border border-white/10 p-6 sm:p-8 rounded-[1.5rem]"
                >
                  <div className="text-[10px] font-bold text-[#F4B41A] uppercase tracking-[0.2em] mb-3">
                    المنطقة
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">{region}</h4>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="py-16 sm:py-24 md:py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center mb-10 sm:mb-20">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 flex justify-center">
            • شهادات العملاء
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-4 sm:mb-6 tracking-tight">
            موثوقون من قبل المشترين
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            استمع إلى المستوردين والموزعين والمشغلين عبر أنحاء المملكة.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="sm:hidden text-xs font-bold text-[#E66A1F] mb-4">
            اسحب لآراء العملاء ←
          </p>
          <div className="sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
            <div className="h-scroll h-scroll-wide">
              {testimonials.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_8px_30px_rgba(10,24,45,0.08)] border border-slate-100 flex flex-col"
                >
                  <Quote size={36} className="text-[#F4B41A]/30 mb-6" />
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 flex-grow font-medium">
                    "{test.quote}"
                  </p>
                  <div className="flex text-[#F4B41A] mb-5 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0A182D] text-lg">
                      {test.author}
                    </h5>
                    <div className="text-sm text-slate-500 mt-1">{test.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-24 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
                • الأسئلة الشائعة
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-6 sm:mb-8 leading-[1.1] tracking-tight">
                تُطرح باستمرار من قبل المشترين
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                إجابات سريعة حول التوريد، الشهادات، اللوجستيات، وأوقات التسليم —
                من شركائنا في المملكة.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-[#0A182D] hover:bg-[#132b52] text-white px-8 py-4 rounded-md font-bold transition-all text-lg"
              >
                تواصل معنا الآن
                <ArrowLeft size={20} className="mr-3" />
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-4">
                {faqData.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-[1.5rem] overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaq(openFaq === idx ? null : idx)
                      }
                      className="w-full text-start px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between font-bold text-[#0A182D] active:bg-slate-50 hover:bg-slate-50 transition-colors text-base sm:text-lg gap-3 sm:gap-4 touch-manipulation min-h-[56px]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={24}
                        className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-8 text-slate-500 text-lg leading-relaxed pt-2">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA + Contact Form ═══ */}
      <section id="contact" className="py-16 sm:py-24 md:py-32 bg-[#0F2442] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center mb-10 sm:mb-16">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 flex justify-center">
            • ابدأ التوريد اليوم
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[4rem] font-black text-white mb-6 sm:mb-8 leading-[1.15] tracking-tight">
            جاهز لتوريد منتجات
            <br /> غذائية فاخرة؟
          </h2>
          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            هل تدير مطعم، سوق مركزي، أو سلسلة تجارية؟ املأ النموذج وسيصلك عرض
            السعر الجملة وأوقات التوصيل خلال ساعة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a
              href="tel:0550266838"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F4B41A] hover:bg-[#d9a015] text-[#0A182D] px-10 py-5 rounded-md font-bold transition-all text-lg"
              dir="ltr"
            >
              📞 055 026 6838
            </a>
            <a
              href="https://wa.me/966550266838"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-md font-bold transition-all text-lg"
            >
              مبيعات الواتساب
            </a>
          </div>
          <a
            href="mailto:tasamiest@gmail.com"
            className="text-white/60 hover:text-[#F4B41A] transition-colors text-sm font-medium"
          >
            ✉️ tasamiest@gmail.com
          </a>
        </div>

        {/* Supply request form */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-12">
          <form
            action="https://formspree.io/f/xjkyzzbq"
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-2xl space-y-4 sm:space-y-5 text-start"
          >
            <h3 className="text-2xl font-black text-[#0A182D] mb-2 text-center">
              📝 قدم طلب توريد الآن
            </h3>

            <div>
              <label
                htmlFor="business"
                className="block text-sm font-bold text-[#0A182D] mb-2"
              >
                اسم المؤسسة أو المطعم
              </label>
              <input
                id="business"
                name="business"
                type="text"
                required
                placeholder="مثال: مطعم الياسمين"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-bold text-[#0A182D] mb-2"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[#0A182D] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F4B41A]/40 focus:border-[#F4B41A] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-bold text-[#0A182D] mb-2"
              >
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
              <label
                htmlFor="product"
                className="block text-sm font-bold text-[#0A182D] mb-2"
              >
                المنتج المطلوب
              </label>
              <select
                id="product"
                name="product"
                required
                defaultValue=""
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
              <label
                htmlFor="quantity"
                className="block text-sm font-bold text-[#0A182D] mb-2"
              >
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
                حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر
                الواتساب.
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-70 text-white py-4 px-6 rounded-md font-extrabold text-lg transition-all hover:scale-[1.01]"
            >
              {formStatus === "sending"
                ? "جاري الإرسال..."
                : "🛒 إرسال طلب التوريد (جملة)"}
            </button>
          </form>
        </div>
      </section>

      {/* ═══ Corporate Footer ═══ */}
      <footer className="bg-[#0A182D] text-white/80 pt-14 sm:pt-20 md:pt-24 pb-10 sm:pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-12 sm:mb-20">
            <div className="space-y-8">
              <a
                href="#home"
                className="inline-flex items-center gap-4 group"
                aria-label="تسامي الوطنية"
              >
                <img
                  src="/logo-mark.png"
                  alt=""
                  aria-hidden="true"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
                <span className="flex flex-col border-r border-white/15 pr-4">
                  <span className="font-brand text-xl sm:text-2xl font-black text-white leading-tight">
                    تسامي <span className="text-[#2A7A42]">الوطنية</span>
                  </span>
                  <span className="font-brand mt-1 text-xs sm:text-sm font-bold text-[#E66A1F]">
                    توريدات الجملة للمطاعم والأسواق
                  </span>
                </span>
              </a>
              <p className="text-sm leading-relaxed text-white/60">
                المورد الموثوق لقطاع المطاعم والأسواق المركزية في المملكة
                العربية السعودية. جودة مضمونة وسلاسل إمداد مبردة.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F4B41A] tracking-[0.2em] uppercase mb-8">
                الشركة
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    من نحن
                  </a>
                </li>
                <li>
                  <a
                    href="#certifications"
                    className="hover:text-white transition-colors"
                  >
                    الشهادات
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F4B41A] tracking-[0.2em] uppercase mb-8">
                المنتجات
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    دواجن مبردة وفريش
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    أفخاذ وصدور دجاج
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    بطاطس شرائح (جملة)
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    بيض طازج من المزارع
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F4B41A] tracking-[0.2em] uppercase mb-8">
                تواصل معنا
              </h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <span className="text-white/60">
                    المملكة العربية السعودية
                  </span>
                </li>
                <li dir="ltr" className="text-right">
                  <a
                    href="tel:0550266838"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    055 026 6838
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:tasamiest@gmail.com"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    tasamiest@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-medium">
            <p>
              جميع الحقوق محفوظة © 2026 - مؤسسة تسامي الوطنية للتوريدات
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/966550266838"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_28px_rgba(37,211,102,0.5)] active:scale-95 hover:scale-105 transition-transform duration-200 touch-manipulation"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
