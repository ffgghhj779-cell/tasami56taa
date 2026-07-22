import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ArrowLeft,
  Check,
  ShieldCheck,
  FileText,
  Snowflake,
  Globe,
  Quote,
  Star,
  Menu,
  X
} from "lucide-react";

// --- Data Objects --- //

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
    icon: Snowflake,
    title: "سلاسل التبريد",
    desc: "نقل وتخزين في درجة -18 مئوية للحفاظ على الجودة.",
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
    desc: "ضمان الجودة من المصنع إلى المستودع وحتى العميل النهائي.",
  },
  {
    title: "اللوجستيات",
    desc: "سلاسل إمداد مبردة موثوقة من أرض المصنع إلى وجهتك.",
  },
];

const products = [
  {
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "دجاج كامل مبرد / مجمد",
    desc: "بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.",
  },
  {
    img: "https://images.unsplash.com/photo-1604543519968-3e5860e6f6cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "أفخاذ دجاج كاملة",
    desc: "بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.",
  },
  {
    img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "صدور دجاج بدون عظم",
    desc: "بدون عظم وجلد؛ يسعر بالوزن. منتجة في منشآت معتمدة تلبي أعلى معايير الجودة والسلامة الغذائية.",
  },
  {
    img: "https://images.unsplash.com/photo-1627308595229-7830f5c92f7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "أجنحة دجاج كاملة",
    desc: "بالعظم والجلد؛ يسعر بالوزن. منتجات معتمدة ومذبوحة وفق الشريعة الإسلامية، مطابقة لمواصفات هيئة الغذاء والدواء.",
  },
  {
    img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "بيض مزارع طازج",
    desc: "بيض مائدة طازج عالي الجودة؛ يسعر بالكرتون. منتج في مزارع معتمدة ومطابقة للاشتراطات الصحية.",
  },
  {
    img: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "بطاطس شرائح مجمدة",
    desc: "بطاطس شرائح جاهزة للقلي؛ يسعر بالكيس. منتجة في مصانع معتمدة وتلبي احتياجات قطاع المطاعم.",
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
    desc: "أسعار تنافسية للجملة خلال 24 ساعة.",
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
    desc: "شحن مباشر إلى مستودعاتك.",
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
    quote: "تسامي الوطنية كانت المورد الأكثر موثوقية لمنتجات الدواجن لدينا طوال السنوات الأربع الماضية. سلاسل التبريد لديهم خالية من العيوب.",
    author: "أحمد المنصوري",
    role: "موزع، الرياض",
  },
  {
    quote: "الامتثال لمعايير الحلال، الجودة المتسقة، والأسعار التنافسية — هذا بالضبط ما تتطلبه أسواقنا وعملائنا بشكل دائم.",
    author: "خالد الراشد",
    role: "مستورد، جدة",
  },
  {
    quote: "منتجاتهم من الدواجن تلبي باستمرار معايير قطاع التجزئة والخدمات الغذائية لدينا بدقة متناهية.",
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

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans text-slate-800 bg-white selection:bg-[#F59E0B] selection:text-white">
      {/* --- Navbar --- */}
      <nav className="bg-[#0A182D] w-full z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-tight">
              تسامي <span className="text-[#F59E0B]">الوطنية</span>
            </span>
            <span className="text-[9px] font-bold text-white/70 tracking-[0.2em] mt-0.5 uppercase">
              للتوريدات والجملة
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10 font-bold text-white text-sm">
            <a href="#" className="text-[#F59E0B] transition-colors">الرئيسية</a>
            <a href="#about" className="hover:text-[#F59E0B] transition-colors">من نحن</a>
            <a href="#products" className="hover:text-[#F59E0B] transition-colors">المنتجات</a>
            <a href="#faq" className="hover:text-[#F59E0B] transition-colors">الأسئلة الشائعة</a>
            <a href="#contact" className="hover:text-[#F59E0B] transition-colors">اتصل بنا</a>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0A182D] border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 font-bold text-white">
                <a href="#" className="text-[#F59E0B]" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</a>
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>من نحن</a>
                <a href="#products" onClick={() => setIsMobileMenuOpen(false)}>المنتجات</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>الأسئلة الشائعة</a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>اتصل بنا</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Premium Hero Section --- */}
      <section className="relative min-h-[90vh] bg-[#0F2442] flex flex-col justify-center pb-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Wholesale Logistics"
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[#0A182D]/40"></div>
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-[11px] sm:text-xs tracking-widest uppercase mb-8">
              <span className="w-5 h-5 rounded-full border border-[#F59E0B] flex items-center justify-center text-[8px] leading-none pt-0.5">SA</span>
              <span>• توريد غذائي معتمد</span>
              <span>• جودة عالية</span>
              <span>• منذ 2014</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-12 max-w-4xl">
              توريدات غذائية <br />
              فاخرة للمطاعم <br />
              والأسواق المركزية
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-4 rounded-md font-bold transition-all text-lg"
              >
                طلب عرض سعر
                <ArrowLeft size={20} />
              </a>
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-md font-bold transition-all backdrop-blur-sm text-lg"
              >
                عرض المنتجات
              </a>
            </div>

            {/* Glass Cards Overlay */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
              {/* Stats Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-3xl font-black text-[#F59E0B] mb-2" dir="ltr">{stat.value}</div>
                      <div className="text-xs font-bold text-white/90 leading-relaxed">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us Intro Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl flex flex-col justify-center">
                <h3 className="text-[#F59E0B] font-bold text-xl mb-4">لماذا تختارنا؟</h3>
                <p className="text-white text-lg leading-relaxed font-medium">
                  نحن رواد السوق في توريد الدواجن والأغذية، موثوقون من قبل الموزعين وشركات الخدمات الغذائية في جميع أنحاء المملكة.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Certifications --- */}
      <section id="certifications" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • الشهادات والثقة
          </div>
          <h2 className="text-4xl lg:text-[2.75rem] font-black text-[#0A182D] mb-6 tracking-tight">
            مبنية للامتثال للمعايير العالمية
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto mb-16">
            كل شحنة مدعومة بالشهادات، والتتبع، والوثائق الصارمة التي يطلبها المشترون وهيئة الغذاء والدواء.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                  <cert.icon size={24} className="text-[#0A182D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A182D] mb-3">{cert.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{cert.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- About Us --- */}
      <section id="about" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Right in RTL (Text) */}
            <div>
              <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • عن المؤسسة
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
                شريكك الموثوق لتوريد الأغذية
              </h2>
              
              <div className="relative mt-12 mb-10 lg:mb-0 hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1558222218-b7b54eede3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Cold Chain Facility"
                  className="rounded-[2rem] h-[28rem] object-cover w-full shadow-lg"
                />
                <div className="absolute -bottom-8 -left-8 bg-[#0A182D] text-white p-8 rounded-3xl shadow-xl w-56 flex flex-col justify-center items-center text-center">
                  <div className="text-[3.5rem] font-black text-[#F59E0B] leading-none mb-2" dir="ltr">13+</div>
                  <div className="text-xs font-bold tracking-[0.1em] uppercase text-white/80">منطقة مخدومة</div>
                </div>
              </div>
            </div>

            {/* Left in RTL (Cards & Text) */}
            <div className="lg:pt-4">
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                مؤسسة تسامي الوطنية هي مورد سعودي موثوق يقدم منتجات الدواجن والأغذية المجمدة عالية الجودة للمشترين التجاريين في جميع أنحاء المملكة العربية السعودية. يمكننا تخصيص المنتجات بمواصفات مختلفة لتناسب احتياجات المطاعم والأسواق المركزية.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                {miniCards.map((card, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
                     <div className="w-8 h-8 rounded-full border border-[#F59E0B]/30 flex items-center justify-center mb-5">
                        <span className="w-2 h-2 rounded-full border-[1.5px] border-[#F59E0B]"></span>
                     </div>
                     <h4 className="text-lg font-bold text-[#0A182D] mb-3">{card.title}</h4>
                     <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-[#0A182D] hover:bg-[#132b52] text-white px-8 py-4 rounded-md font-bold transition-all text-lg"
              >
                تحدث مع فريق التوريد
                <ArrowLeft size={20} className="mr-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Products --- */}
      <section id="products" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • المنتجات المميزة
          </div>
          
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] max-w-3xl leading-[1.05] tracking-tight mb-6">
            لمحة عن كتالوج التوريد الخاص بنا
          </h2>
          <p className="text-slate-500 text-lg mb-16">
            استكشف المنتجات والأصناف الأكثر طلباً من قبل شركائنا في قطاع المطاعم والأسواق المركزية.
          </p>

          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-[#0A182D]">أفضل المنتجات مبيعاً</h3>
            <a href="#contact" className="text-sm font-bold text-[#0A182D] hover:text-[#F59E0B] transition-colors inline-flex items-center gap-1">
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
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 p-8 flex flex-col group"
              >
                <div className="bg-[#F8FAFC] rounded-2xl mb-8 flex items-center justify-center p-8 h-64 border border-slate-100/50">
                   <div className="relative w-full h-full bg-white shadow-sm border border-slate-200/50 rounded-xl overflow-hidden flex items-center justify-center p-2 transform group-hover:scale-105 transition-transform duration-500">
                     <img src={product.img} alt={product.title} className="w-full h-full object-cover rounded-lg" />
                   </div>
                </div>
                <h4 className="text-xl font-bold text-[#0A182D] mb-4">{product.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">{product.desc}</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center w-max px-6 py-3 border border-[#F59E0B] text-[#0A182D] rounded-md font-bold transition-all text-sm hover:bg-[#F59E0B] hover:text-white"
                >
                  طلب تسعيرة
                  <ArrowLeft size={16} className="mr-2" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Export Process --- */}
      <section className="py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            • عملية التوريد
          </div>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-white mb-6 leading-[1.05] tracking-tight">
            من الاستفسار إلى وجهتك النهائية
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mb-20">
            عملية مبسطة من خمس خطوات مصممة للمشترين الذين يقدرون السرعة، الدقة، والشفافية.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-[#172A46] border border-white/5 p-8 rounded-[2rem]"
              >
                <div className="text-3xl font-black text-[#F59E0B] mb-6" dir="ltr">{step.num}</div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why Choose Us --- */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-5">
              <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • لماذا تختارنا
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
                مبنية لشركاء التجارة والأعمال
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                ثمانية أسباب تجعل المشترين من كافة أنحاء المملكة يختارون مؤسسة تسامي الوطنية كشريك توريد طويل الأمد لمنتجات الدواجن والأغذية.
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
                    className="flex items-start gap-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgb(0,0,0,0.02)]"
                  >
                    <span className="text-[#F59E0B] font-bold text-lg leading-none mt-1" dir="ltr">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[#0A182D] font-bold text-sm leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Global Markets / Coverage --- */}
      <section className="py-32 bg-[#0F2442]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center mb-20">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4 flex justify-center">
            • التغطية المحلية
          </div>
          <h2 className="text-4xl lg:text-[3.5rem] font-black text-white mb-6 tracking-tight">
            الشحن لجميع المناطق
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            موثوقون من قبل المستوردين والموزعين وسلاسل السوبر ماركت في الأسواق الأكثر تطلباً في المملكة.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Map Placeholder */}
            <div className="bg-[#172A46] rounded-[2rem] border border-white/5 h-[480px] flex items-center justify-center relative overflow-hidden">
               <Globe size={400} className="text-white/[0.03] absolute -right-20 -bottom-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-[#F59E0B] rounded-full blur-[80px] opacity-20"></div>
                    <div className="w-4 h-4 bg-[#F59E0B] rounded-full relative z-10 shadow-[0_0_20px_rgba(245,158,11,1)]"></div>
                 </div>
               </div>
            </div>

            {/* Regions Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {regions.map((region, idx) => (
                <div key={idx} className="bg-[#172A46] border border-white/5 p-8 rounded-[1.5rem]">
                  <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-[0.2em] mb-3">المنطقة</div>
                  <h4 className="text-xl font-bold text-white">{region}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center mb-20">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4 flex justify-center">
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
                <Quote size={40} className="text-[#F59E0B]/30 mb-8" />
                <p className="text-slate-600 text-lg leading-relaxed mb-10 flex-grow font-medium">"{test.quote}"</p>
                <div className="flex text-[#F59E0B] mb-6 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <div>
                  <h5 className="font-bold text-[#0A182D] text-lg">{test.author}</h5>
                  <div className="text-sm text-slate-500 mt-1">{test.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 sticky top-32">
              <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                • الأسئلة الشائعة
              </div>
              <h2 className="text-4xl lg:text-[3.5rem] font-black text-[#0A182D] mb-8 leading-[1.05] tracking-tight">
                تُطرح باستمرار من قبل المشترين
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                إجابات سريعة حول التوريد، الشهادات، اللوجستيات، وأوقات التسليم — من شركائنا في المملكة.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center bg-[#0A182D] hover:bg-[#132b52] text-white px-8 py-4 rounded-md font-bold transition-all text-lg"
              >
                رؤية كافة الأسئلة
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
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-start px-8 py-6 flex items-center justify-between font-bold text-[#0A182D] hover:bg-slate-50 transition-colors text-lg"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={24} 
                        className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} 
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

      {/* --- CTA Section --- */}
      <section id="contact" className="py-32 bg-[#0F2442] text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-[#F59E0B] text-xs font-bold tracking-[0.2em] uppercase mb-6 flex justify-center">
            • ابدأ التوريد اليوم
          </div>
          <h2 className="text-4xl lg:text-[4rem] font-black text-white mb-8 leading-[1.05] tracking-tight">
            جاهز لتوريد منتجات <br/> غذائية فاخرة؟
          </h2>
          <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            اتصل بمؤسسة تسامي الوطنية للحصول على معلومات حول توريد الأغذية بكميات كبيرة، واللوجستيات المبردة، وعروض الأسعار التنافسية.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F59E0B] hover:bg-[#d98906] text-[#0A182D] px-10 py-5 rounded-md font-bold transition-all text-lg"
            >
              طلب عرض سعر
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
        </div>
      </section>

      {/* --- Corporate Footer --- */}
      <footer className="bg-[#0A182D] text-white/80 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            
            <div className="space-y-8">
              <div>
                <span className="text-2xl font-black text-white tracking-tight block">
                  تسامي <span className="text-[#F59E0B]">الوطنية</span>
                </span>
                <span className="text-[10px] font-bold text-white/50 tracking-[0.2em] mt-1 uppercase block">
                  للتوريدات الغذائية
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                المورد الموثوق لقطاع المطاعم والأسواق المركزية في المملكة العربية السعودية. جودة مضمونة وسلاسل إمداد مبردة.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F59E0B] tracking-[0.2em] uppercase mb-8">الشركة</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#certifications" className="hover:text-white transition-colors">الشهادات</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F59E0B] tracking-[0.2em] uppercase mb-8">المنتجات</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#products" className="hover:text-white transition-colors">دواجن كاملة مبردة ومجمدة</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">أفخاذ وصدور دجاج</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">بطاطس شرائح (جملة)</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">بيض طازج من المزارع</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-[#F59E0B] tracking-[0.2em] uppercase mb-8">تواصل معنا</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><span className="text-white/60">المملكة العربية السعودية، الرياض</span></li>
                <li dir="ltr" className="text-right"><span className="text-white/60">055 026 6838</span></li>
                <li><span className="text-white/60">tasamiest@gmail.com</span></li>
              </ul>
            </div>
            
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-medium">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} مؤسسة تسامي الوطنية للتوريدات والتصدير.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
