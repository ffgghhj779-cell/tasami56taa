import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Menu,
  X,
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
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80",
    title: "دواجن مبردة",
    desc: "كميات تبدأ من 10 كرتون. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.",
  },
  {
    img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
    title: "دواجن فريش",
    desc: "كميات تبدأ من 10 كرتون. طازجة يومياً لتلبية احتياجات المطاعم والأسواق المركزية.",
  },
  {
    img: "https://images.unsplash.com/photo-1518013431117-eb94217b7943?auto=format&fit=crop&w=800&q=80",
    title: "بطاطس شرائح (مجمدة)",
    desc: "كميات تبدأ من 20 كيس. بطاطس شرائح جاهزة للقلي تلبي احتياجات قطاع المطاعم.",
  },
  {
    img: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
    title: "بيض طازج (مزارع)",
    desc: "كميات تبدأ من 50 كرتونة. بيض مائدة طازج عالي الجودة من مزارع معتمدة.",
  },
  {
    img: "https://images.unsplash.com/photo-1604543519968-3e5860e6f6cb?auto=format&fit=crop&w=800&q=80",
    title: "أفخاذ دجاج كاملة",
    desc: "بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومطابقة لأعلى معايير الجودة.",
  },
  {
    img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
    <div className="font-sans text-slate-800 bg-white selection:bg-[#F4B41A] selection:text-white">
      {/* ═══ Navbar — dark navy like Shengda ═══ */}
      <nav className="bg-[#0A182D] w-full z-50 sticky top-0 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[88px] md:h-24 flex justify-between items-center">
          <a
            href="#home"
            className="flex items-center gap-3 sm:gap-4 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F4B41A]/60 rounded-lg"
            aria-label="تسامي الوطنية — الصفحة الرئيسية"
          >
            <img
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              className="h-11 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="flex flex-col justify-center border-r border-white/15 pr-3 sm:pr-4 min-w-0">
              <span className="font-brand text-base sm:text-xl md:text-2xl font-black leading-tight tracking-tight text-white group-hover:text-white/95 transition-colors">
                تسامي{" "}
                <span className="text-[#2A7A42]">الوطنية</span>
              </span>
              <span className="font-brand mt-0.5 text-[10px] sm:text-xs md:text-[13px] font-bold leading-snug text-[#E66A1F]">
                توريدات الجملة للمطاعم والأسواق
              </span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10 font-bold text-white text-sm">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-[#F4B41A] ${
                  i === 0 ? "text-[#F4B41A]" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            aria-label="القائمة"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0A182D] border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 font-bold text-white">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-[#F4B41A] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ Hero — centered, dark overlay ═══ */}
      <section
        id="home"
        className="relative min-h-[92vh] bg-[#0F2442] flex flex-col justify-center pb-36"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80"
            alt="توريدات ولوجستيات الجملة"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[#0A182D]/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A182D]/80 via-transparent to-[#0A182D]/40" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 mt-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2 text-[#F4B41A] font-bold text-[11px] sm:text-xs tracking-widest uppercase mb-8 flex-wrap">
              <span className="w-5 h-5 rounded-full border border-[#F4B41A] flex items-center justify-center text-[8px] leading-none">
                SA
              </span>
              <span>• توريد غذائي معتمد</span>
              <span>• جودة عالية</span>
              <span>• منذ 2014</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white leading-[1.1] tracking-tight mb-8 max-w-4xl mx-auto">
              توريدات جملة فاخرة
              <br />
              للمطاعم والأسواق المركزية
            </h1>

            <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              نورد الدواجن المبردة والفريش، البطاطس المجمدة، والبيض الطازج —
              بجودة مضمونة وأسعار جملة تنافسية وتوصيل مبرد إلى جميع أنحاء المملكة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-4 rounded-md font-bold transition-all text-lg shadow-[0_8px_24px_rgba(22,163,74,0.35)] hover:scale-[1.03]"
              >
                طلب عرض سعر
                <ArrowLeft size={20} />
              </a>
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/25 px-8 py-4 rounded-md font-bold transition-all backdrop-blur-sm text-lg hover:scale-[1.03]"
              >
                عرض المنتجات
              </a>
            </div>

            {/* Glass cards — stats + why choose us */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto text-start">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <div
                        className="text-3xl font-black text-[#F4B41A] mb-2"
                        dir="ltr"
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs font-bold text-white/90 leading-relaxed">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col justify-center">
                <h3 className="text-[#F4B41A] font-bold text-xl mb-4">
                  لماذا تختارنا؟
                </h3>
                <p className="text-white text-lg leading-relaxed font-medium">
                  نحن رواد السوق في توريد الدواجن والأغذية، موثوقون من قبل
                  الموزعين وشركات الخدمات الغذائية في جميع أنحاء المملكة.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Certifications ═══ */}
      <section id="certifications" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • الشهادات والثقة
          </div>
          <h2 className="text-4xl lg:text-[2.75rem] font-black text-[#0A182D] mb-6 tracking-tight">
            مبنية للامتثال للمعايير العالمية
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto mb-16">
            كل شحنة مدعومة بالشهادات، والتتبع، والوثائق الصارمة التي يطلبها
            المشترون وهيئة الغذاء والدواء.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center hover:shadow-[0_12px_40px_rgba(10,24,45,0.08)] hover:-translate-y-1 transition-all duration-300"
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
      </section>

      {/* ═══ About Us ═══ */}
      <section id="about" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • عن المؤسسة
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
                شريكك الموثوق لتوريد الأغذية
              </h2>

              <div className="relative mt-12 mb-10 lg:mb-0 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?auto=format&fit=crop&w=1000&q=80"
                  alt="منشأة سلاسل التبريد"
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

              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {miniCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-8 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_32px_rgba(10,24,45,0.08)] transition-shadow"
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
      <section id="products" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • المنتجات المميزة
          </div>

          <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] max-w-3xl leading-[1.05] tracking-tight mb-6">
            لمحة عن كتالوج التوريد الخاص بنا
          </h2>
          <p className="text-slate-500 text-lg mb-16">
            استكشف المنتجات والأصناف الأكثر طلباً من قبل شركائنا في قطاع
            المطاعم والأسواق المركزية.
          </p>

          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-[#0A182D]">
              أفضل المنتجات مبيعاً
            </h3>
            <a
              href="#contact"
              className="text-sm font-bold text-[#0A182D] hover:text-[#F4B41A] transition-colors inline-flex items-center gap-1"
            >
              عرض الكل <ArrowLeft size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 p-8 flex flex-col group hover:shadow-[0_16px_48px_rgba(10,24,45,0.1)] transition-shadow duration-300"
              >
                <div className="bg-[#F8FAFC] rounded-2xl mb-8 flex items-center justify-center p-8 h-64 border border-slate-100/50">
                  <div className="relative w-full h-full bg-white shadow-sm border border-slate-200/50 rounded-xl overflow-hidden flex items-center justify-center p-2 transform group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-[#0A182D] mb-4">
                  {product.title}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  {product.desc}
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center w-max px-6 py-3 border border-[#F4B41A] text-[#0A182D] rounded-md font-bold transition-all text-sm hover:bg-[#F4B41A] hover:text-[#0A182D]"
                >
                  طلب تسعيرة
                  <ArrowLeft size={16} className="mr-2" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Supply Process — dark ═══ */}
      <section className="py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • عملية التوريد
          </div>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-white mb-6 leading-[1.05] tracking-tight">
            من الاستفسار إلى وجهتك النهائية
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mb-20">
            عملية مبسطة من خمس خطوات مصممة للمشترين الذين يقدرون السرعة،
            الدقة، والشفافية.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-[#172A46] border border-white/5 p-8 rounded-[2rem] hover:border-[#F4B41A]/30 transition-colors"
              >
                <div
                  className="text-3xl font-black text-[#F4B41A] mb-6"
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
      </section>

      {/* ═══ Why Choose Us — 8 reasons ═══ */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • لماذا تختارنا
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
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
              <div className="grid sm:grid-cols-2 gap-4">
                {reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(10,24,45,0.06)] transition-shadow"
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
      </section>

      {/* ═══ Coverage / Markets ═══ */}
      <section className="py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center mb-20">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4 flex justify-center">
            • التغطية المحلية
          </div>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-white mb-6 tracking-tight">
            الشحن لجميع المناطق
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            موثوقون من قبل المستوردين والموزعين وسلاسل السوبر ماركت في الأسواق
            الأكثر تطلباً في المملكة.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-[#172A46] rounded-[2rem] border border-white/5 h-[480px] flex items-center justify-center relative overflow-hidden">
              <Globe
                size={400}
                className="text-white/[0.03] absolute -right-20 -bottom-20"
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

            <div className="grid sm:grid-cols-2 gap-4">
              {regions.map((region, idx) => (
                <div
                  key={idx}
                  className="bg-[#172A46] border border-white/5 p-8 rounded-[1.5rem] hover:border-[#F4B41A]/25 transition-colors"
                >
                  <div className="text-[10px] font-bold text-[#F4B41A] uppercase tracking-[0.2em] mb-3">
                    المنطقة
                  </div>
                  <h4 className="text-xl font-bold text-white">{region}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center mb-20">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4 flex justify-center">
            • شهادات العملاء
          </div>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-6 tracking-tight">
            موثوقون من قبل المشترين
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            استمع إلى المستوردين والموزعين والمشغلين عبر أنحاء المملكة.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="bg-white p-10 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col"
              >
                <Quote size={40} className="text-[#F4B41A]/30 mb-8" />
                <p className="text-slate-600 text-lg leading-relaxed mb-10 flex-grow font-medium">
                  "{test.quote}"
                </p>
                <div className="flex text-[#F4B41A] mb-6 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
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
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 sticky top-32">
              <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • الأسئلة الشائعة
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
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
                      className="w-full text-start px-8 py-6 flex items-center justify-between font-bold text-[#0A182D] hover:bg-slate-50 transition-colors text-lg gap-4"
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
      <section id="contact" className="py-32 bg-[#0F2442] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center mb-16">
          <div className="text-[#F4B41A] text-xs font-bold tracking-[0.2em] uppercase mb-6 flex justify-center">
            • ابدأ التوريد اليوم
          </div>
          <h2 className="text-4xl lg:text-[4rem] font-black text-white mb-8 leading-[1.05] tracking-tight">
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
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <form
            action="https://formspree.io/f/xjkyzzbq"
            method="POST"
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl space-y-5 text-start"
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
      <footer className="bg-[#0A182D] text-white/80 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
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
        className="fixed bottom-6 left-6 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_28px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.65)] hover:scale-110 transition-all duration-300"
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
      </a>
    </div>
  );
}
