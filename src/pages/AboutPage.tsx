import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ChefHat,
  ClipboardList,
  Coffee,
  CreditCard,
  FileText,
  Hotel,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  ShoppingBasket,
  Snowflake,
  Store,
  Truck,
} from "lucide-react";
import SiteFrame from "@/src/components/SiteFrame";
import { catalogCategories, catalogProducts, type CatalogCategoryId } from "@/src/data/catalog";

const WHATSAPP = "https://wa.me/966550266838";
const waLink = (text: string) => `${WHATSAPP}?text=${encodeURIComponent(text)}`;

const LEGAL = {
  name: "مؤسسة تسامي الوطنية",
  trade: "تسامي الوطنية",
  cr: "7051037930",
  vat: "314091043600003",
  address: "ينبع، حي الحدائق، شارع الملك عبدالعزيز ابن عبدالرحمن سعود، مبنى 2452",
  postal: "46429",
  shortAddress: "YADB2452",
  phoneDisplay: "055 026 6838",
  phoneTel: "0550266838",
  email: "tasamiest@gmail.com",
};

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "شارع الملك عبدالعزيز، حي الحدائق، ينبع 46429",
)}`;

const CATEGORY_COVERS: Partial<Record<CatalogCategoryId, string>> = {
  poultry: "/catalog/premium/chicken-whole-chilled.jpg",
  fresh_produce: "/catalog/premium/fresh-tomato.jpg",
  frozen_veg_fruit: "/catalog/premium/frozen-mixed-veg.jpg",
  frozen_fries: "/catalog/premium/frozen-fries.jpg",
  oils_sauces_tuna: "/catalog/premium/tuna-chunks.jpg",
  fresh_juices: "/catalog/premium/juice-mango-strawberry.jpg",
  rice_pulses: "/catalog/premium/rice-egyptian.jpg",
  eggs: "/catalog/premium/eggs-farm.jpg",
  frozen_meat: "/catalog/premium/lamb-chilled.jpg",
  dates: "/catalog/premium/dates-ajwa.jpg",
  beverages: "/catalog/premium/red-bull-can.jpg",
};

const PRODUCT_COUNT = catalogProducts.length;
const CATEGORY_COUNT = catalogCategories.length;
const BRANDS = Array.from(new Set(catalogProducts.map((p) => p.brand).filter(Boolean))) as string[];

function countIn(id: CatalogCategoryId) {
  return catalogProducts.filter((p) => p.category === id).length;
}

function coverFor(id: CatalogCategoryId) {
  return CATEGORY_COVERS[id] ?? catalogProducts.find((p) => p.category === id)?.img ?? "/logo.png";
}

const JOURNEY = [
  {
    icon: Send,
    title: "تقديم الاستفسار",
    body: "تشاركنا الأصناف والكميات والمدينة عبر واتساب، أو نموذج الطلب، أو السلة في الموقع.",
    chip: "واتساب · نموذج · سلة",
  },
  {
    icon: FileText,
    title: "استلام التسعيرة",
    body: "نراجع طلبك ونرسل عرض سعر الجملة بعد تحديد الصنف والكمية والمدينة.",
    chip: "عرض سعر مكتوب",
  },
  {
    icon: ShieldCheck,
    title: "الجودة والوثائق",
    body: "نراجع الشهادات والوثائق المصاحبة للتوريد قبل تجهيز الطلب.",
    chip: "وثائق كل توريد",
  },
  {
    icon: Snowflake,
    title: "التعبئة والتبريد",
    body: "يُجهز الطلب ويُغلف، وتبقى المنتجات المبردة والمجمدة في درجة التبريد المناسبة.",
    chip: "سلسلة تبريد",
  },
  {
    icon: Truck,
    title: "التوصيل",
    body: "توصيل مبرد إلى مطعمك أو مستودعك، وموعد الاستلام يُؤكد مع فريق المبيعات حسب المدينة والكمية.",
    chip: "مبرد · حسب المدينة",
  },
];

const SEGMENTS = [
  {
    icon: ChefHat,
    title: "المطاعم",
    body: "دواجن، بطاطس مجمدة، خضار، زيوت وصلصات، ولحوم لمطابخ تعمل كل يوم.",
    href: "/restaurants",
  },
  {
    icon: Coffee,
    title: "الكافيهات والمخابز",
    body: "بيض، ألبان وأجبان، عصائر ولب فاكهة، ومشروبات جاهزة.",
    href: "/restaurants",
  },
  {
    icon: Hotel,
    title: "الفنادق والتموين",
    body: "مياه معبأة، تمور للضيافة، وأقسام المطبخ كاملة من كتالوج واحد.",
    href: "/restaurants",
  },
  {
    icon: Store,
    title: "الأسواق والبقالات",
    body: "أرز، بيض، ألبان، تمور، مشروبات ومياه بكميات الجملة لرفوفك.",
    href: "/markets",
  },
];

const COMPARISON = [
  {
    need: "أقسام مطبخك",
    scattered: "مورد مختلف لكل صنف",
    tasami: `${CATEGORY_COUNT} قسمًا في كتالوج واحد`,
  },
  {
    need: "السعر",
    scattered: "أسعار متفرقة بشروط مختلفة",
    tasami: "عرض سعر جملة مكتوب بعد مراجعة الكمية والمدينة",
  },
  {
    need: "المنتجات المبردة",
    scattered: "تختلف من مورد لآخر",
    tasami: "توصيل مبرد للمنتجات التي تحتاج تبريدًا",
  },
  {
    need: "طريقة الطلب",
    scattered: "مكالمات ورسائل مع أكثر من جهة",
    tasami: "واتساب، أو نموذج طلب، أو سلة أونلاين",
  },
  {
    need: "الدفع",
    scattered: "يختلف من مورد لآخر",
    tasami: "مدى · فيزا · ماستركارد · تحويل بنكي",
  },
  {
    need: "الجهة التي تتعامل معها",
    scattered: "جهات متعددة",
    tasami: `منشأة مسجلة بسجل تجاري ${LEGAL.cr} ورقم ضريبي`,
  },
  {
    need: "أرز سلام المصري",
    scattered: "عبر أكثر من وسيط",
    tasami: "مباشرة من الوكيل الحصري في السعودية",
  },
];

const TERMS = [
  { icon: FileText, value: "مكتوب", title: "عرض السعر", body: "يُرسل بعد تحديد الصنف والكمية والمدينة." },
  { icon: Snowflake, value: "مبرد", title: "التوصيل", body: "المدينة والموعد يُؤكدان مع فريق المبيعات قبل التوريد." },
  { icon: CreditCard, value: "4 طرق", title: "الدفع", body: "مدى، فيزا، ماستركارد، أو تحويل بنكي بعد تأكيد الطلب." },
  { icon: ShoppingBasket, value: "3 طرق", title: "الطلب", body: "سلة الموقع، نموذج طلب التوريد، أو واتساب المبيعات." },
];

const VALUES = [
  {
    icon: BadgeCheck,
    title: "الوضوح قبل الوعد",
    body: "لا ننشر مدنًا أو مواعيد توصيل قبل تأكيدها معك. ما نعد به، نكون قد تأكدنا منه.",
  },
  {
    icon: ShieldCheck,
    title: "الجودة بالوثائق",
    body: "نراجع الشهادات والوثائق المصاحبة لكل توريد، لأن الجودة تُثبت ولا تُقال.",
  },
  {
    icon: Snowflake,
    title: "التبريد حتى الباب",
    body: "المنتج المبرد يبقى مبردًا من المصدر إلى وجهتك، لأن جودته تبدأ من درجة حرارته.",
  },
  {
    icon: ClipboardList,
    title: "الكتالوج كما هو",
    body: "نعرض الأصناف الموجودة فعلًا بعبواتها ومواصفاتها، حتى تعرف ما ستستلمه قبل أن تطلب.",
  },
];

const FAQS = [
  {
    q: "من هي مؤسسة تسامي الوطنية؟",
    a: `منشأة سعودية مسجلة في ينبع (سجل تجاري ${LEGAL.cr})، تورد منتجات غذائية بالجملة للمطاعم والكافيهات والمخابز والفنادق وشركات التموين والأسواق والبقالات داخل المملكة.`,
  },
  {
    q: "ما المنتجات التي توردونها؟",
    a: `يضم الكتالوج ${PRODUCT_COUNT} صنفًا في ${CATEGORY_COUNT} قسمًا، منها الدواجن المبردة والمجمدة، والخضار والفواكه الطازجة والمجمدة، والبطاطس المجمدة، والأرز والبقوليات، والبيض، واللحوم، والتمور، والألبان، والمشروبات، ومياه الشرب.`,
  },
  {
    q: "هل تسامي الوطنية وكيل أرز سلام؟",
    a: "نعم، تسامي الوطنية الوكيل الحصري لأرز سلام المصري في السعودية، بالأبيض والكالروز وبعبوات 5 و25 كجم للجملة.",
  },
  {
    q: "أين مقر المؤسسة؟",
    a: `${LEGAL.address}، الرمز البريدي ${LEGAL.postal}، والعنوان المختصر ${LEGAL.shortAddress}. هذا عنوان السجل، ومدن التوصيل تُؤكد مع فريق المبيعات.`,
  },
  {
    q: "هل توصلون إلى مدينتي؟",
    a: "أرسل لنا المدينة ونوع المنتجات والكمية التقريبية، ويؤكد لك الفريق إذا كانت مدينتك ضمن التوصيل الحالي وموعد الاستلام المناسب.",
  },
  {
    q: "كيف أطلب عرض سعر؟",
    a: "عبر واتساب المبيعات، أو نموذج طلب التوريد في الموقع، أو أضف الأصناف إلى السلة واطلب أونلاين. نراجع الطلب ثم نرسل عرض سعر الجملة.",
  },
  {
    q: "ما طرق الدفع المتاحة؟",
    a: "بطاقات مدى وفيزا وماستركارد عبر الموقع، أو تحويل بنكي نرسل بياناته بعد تأكيد الطلب، أو تسجيل الطلب وإتمام الدفع مع الفريق.",
  },
];

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2.5 text-[11px] sm:text-xs font-extrabold tracking-[0.14em] mb-3 sm:mb-4 ${
        light ? "text-[#F4B41A]" : "text-[#E66A1F]"
      }`}
    >
      <span className={`h-px w-7 ${light ? "bg-[#F4B41A]" : "bg-[#E66A1F]"}`} aria-hidden />
      {children}
    </p>
  );
}

function SectionTitle({
  eyebrow,
  title,
  accent,
  lead,
  light = false,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl mb-8 sm:mb-12">
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`font-brand text-[1.7rem] leading-[1.25] sm:text-[2.6rem] font-black ${
          light ? "text-white" : "text-[#0A182D]"
        }`}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className="text-[#E66A1F]">{accent}</span>
          </>
        )}
      </h2>
      {lead && (
        <p className={`mt-3 sm:mt-4 text-[15px] sm:text-lg leading-relaxed ${light ? "text-white/75" : "text-slate-600"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

function useAboutJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          url: "https://www.tasamialwatania.com/about",
          name: "من نحن | مؤسسة تسامي الوطنية",
          inLanguage: "ar-SA",
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, []);
}

export default function AboutPage() {
  useAboutJsonLd();

  return (
    <SiteFrame
      bare
      title="من نحن | مؤسسة تسامي الوطنية لتوريد الأغذية بالجملة"
      description={`مؤسسة تسامي الوطنية، ينبع: توريد أغذية بالجملة للمطاعم والفنادق والأسواق. ${PRODUCT_COUNT} صنفًا في ${CATEGORY_COUNT} قسمًا، توصيل مبرد، والوكيل الحصري لأرز سلام في السعودية.`}
    >
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#FBF8F3]">
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#F4B41A]/15 blur-3xl"
          aria-hidden
        />
        <Shell className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center py-10 sm:py-16 lg:py-20">
          <div className="min-w-0">
            <Eyebrow>عن مؤسسة تسامي الوطنية</Eyebrow>
            <h1 className="font-brand text-[2.1rem] leading-[1.2] sm:text-5xl lg:text-[3.6rem] font-black text-[#0A182D]">
              مورد أغذية بالجملة
              <br />
              <span className="text-[#E66A1F]">للمطاعم والأسواق</span>
            </h1>
            <p className="mt-4 sm:mt-5 font-brand text-lg sm:text-2xl font-bold text-[#0E2A47] leading-snug">
              أصناف واضحة، عرض سعر مكتوب، وتوصيل مبرد حتى مطبخك.
            </p>
            <p className="mt-4 text-[15px] sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              مؤسسة تسامي الوطنية منشأة سعودية مسجلة في ينبع، تورد منتجات غذائية بالجملة للمطاعم والكافيهات
              والمخابز والفنادق وشركات التموين والأسواق والبقالات داخل المملكة. يضم كتالوجنا {PRODUCT_COUNT} صنفًا
              في {CATEGORY_COUNT} قسمًا، ونحن الوكيل الحصري لأرز سلام المصري في السعودية.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink("السلام عليكم، أرغب في الاستفسار عن توريد الجملة من تسامي الوطنية")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl bg-[#15803D] text-white font-extrabold shadow-[0_12px_30px_-12px_rgba(21,128,61,0.7)] touch-manipulation"
              >
                <MessageCircle className="h-5 w-5" />
                اطلب عرض سعر على واتساب
              </a>
              <Link
                to="/#products"
                className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl border-2 border-[#0E2A47] text-[#0E2A47] font-extrabold touch-manipulation"
              >
                تصفح الكتالوج
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl">
              {[
                { v: String(CATEGORY_COUNT), l: "قسمًا في الكتالوج" },
                { v: String(PRODUCT_COUNT), l: "صنفًا للجملة" },
                { v: String(BRANDS.length), l: "علامة تجارية نوردها" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white border border-[#0E2A47]/10 px-3 py-3.5 sm:px-4 sm:py-4 shadow-sm">
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="font-brand text-2xl sm:text-4xl font-black text-[#0E2A47] leading-none">{s.v}</dd>
                  <dd className="mt-1.5 text-[11px] sm:text-sm font-bold text-slate-500 leading-tight">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-w-0">
            <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
              <div className="row-span-2 overflow-hidden rounded-[1.6rem] shadow-[0_30px_60px_-30px_rgba(10,24,45,0.55)]">
                <img
                  src="/catalog/premium/chicken-breast-slate.jpg"
                  alt="صدور دجاج طازجة"
                  className="h-full min-h-[300px] sm:min-h-[440px] w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[1.4rem] shadow-lg">
                <img src="/catalog/premium/dates-ajwa.jpg" alt="تمر عجوة" className="h-[145px] sm:h-[212px] w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-[1.4rem] shadow-lg">
                <img
                  src="/catalog/premium/fresh-pomegranate.jpg"
                  alt="رمان طازج"
                  className="h-[145px] sm:h-[212px] w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 right-3 sm:right-6 flex items-center gap-3 rounded-2xl bg-[#0A182D] text-white px-4 py-3 shadow-2xl">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F4B41A] text-[#0A182D]">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-white/60 font-bold">منشأة مسجلة · ينبع</span>
                <span className="block font-brand font-black text-sm sm:text-base" dir="ltr">
                  CR {LEGAL.cr}
                </span>
              </span>
            </div>
          </div>
        </Shell>
      </section>

      {/* ── Trust strip ── */}
      <div className="bg-[#0A182D] text-white">
        <Shell>
          <ul className="flex gap-3 sm:gap-6 overflow-x-auto py-4 text-[13px] sm:text-sm font-bold whitespace-nowrap [scrollbar-width:none]">
            {[
              `سجل تجاري ${LEGAL.cr}`,
              `رقم ضريبي ${LEGAL.vat}`,
              "توصيل مبرد",
              "الوكيل الحصري لأرز سلام",
              "مدى · فيزا · ماستركارد",
              "عرض سعر مكتوب للجملة",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 shrink-0">
                <BadgeCheck className="h-4 w-4 text-[#F4B41A]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </Shell>
      </div>

      {/* ── In detail + at a glance ── */}
      <section className="bg-white py-14 sm:py-24">
        <Shell className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
          <div className="min-w-0">
            <SectionTitle eyebrow="من نحن" title="تسامي الوطنية،" accent="بالتفصيل" />
            <p className="font-brand text-xl sm:text-2xl font-bold text-[#0E2A47] leading-relaxed">
              نجمع أقسام مطبخك في مكان واحد. بدل أن تتعامل مع مورد للدواجن وآخر للمجمدات وثالث للأرز، ترسل طلبًا
              واحدًا وتستلم عرض سعر واحدًا.
            </p>
            <p className="mt-5 text-[15px] sm:text-lg text-slate-600 leading-relaxed">
              تعمل مؤسسة تسامي الوطنية في توريد الأغذية بالجملة داخل المملكة العربية السعودية. نورد ما يحتاجه المطعم
              والفندق والسوق كل أسبوع، من الدواجن المبردة والبطاطس المجمدة والبيض الطازج، إلى الخضار والفواكه والأرز
              والتمور والمشروبات ومياه الشرب، ونرسل السعر بعد مراجعة الصنف والكمية والمدينة.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="rounded-2xl border border-slate-200 bg-[#FBF8F3] p-5 sm:p-6">
                <Eyebrow>ما نورده</Eyebrow>
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  {CATEGORY_COUNT} قسمًا و{PRODUCT_COUNT} صنفًا منشورة في الكتالوج بعبواتها ومواصفاتها.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {catalogCategories.slice(0, 8).map((c) => (
                    <span key={c.id} className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-[#0E2A47]">
                      {c.title}
                    </span>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border border-[#F4B41A]/40 bg-[#FFF8E6] p-5 sm:p-6">
                <Eyebrow>وكالة حصرية</Eyebrow>
                <p className="font-brand text-xl font-black text-[#0A182D]">أرز سلام المصري</p>
                <p className="mt-2 text-slate-700 leading-relaxed text-[15px]">
                  أبيض وكالروز بعبوات 5 و25 كجم للجملة. تسامي الوطنية الوكيل الحصري في السعودية.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-[#FBF8F3] p-5 sm:p-6">
                <Eyebrow>الجودة</Eyebrow>
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  نراجع الشهادات والوثائق المصاحبة لكل توريد، والمنتجات التي تحتاج تبريدًا تُنقل بتوصيل مبرد.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-[#FBF8F3] p-5 sm:p-6">
                <Eyebrow>علامات نوردها</Eyebrow>
                <p className="text-slate-700 leading-relaxed text-[15px]">
                  {BRANDS.length} علامة تجارية في الكتالوج، منها:
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {BRANDS.slice(0, 10).map((b) => (
                    <span key={b} className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 rounded-[1.6rem] bg-[#0A182D] text-white p-6 sm:p-7 shadow-[0_30px_60px_-30px_rgba(10,24,45,0.7)]">
            <Eyebrow light>بطاقة المنشأة</Eyebrow>
            <dl className="divide-y divide-white/10 text-sm">
              {[
                ["الاسم النظامي", LEGAL.name],
                ["الاسم التجاري", LEGAL.trade],
                ["السجل التجاري", LEGAL.cr],
                ["الرقم الضريبي", LEGAL.vat],
                ["المقر", "ينبع، حي الحدائق"],
                ["العنوان المختصر", LEGAL.shortAddress],
                ["مجال العمل", "توريد أغذية بالجملة"],
                ["العملاء", "مطاعم · فنادق · أسواق"],
                ["الوكالة الحصرية", "أرز سلام المصري"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="text-white/55 font-bold shrink-0">{k}</dt>
                  <dd className="font-extrabold text-left break-all" dir={/^[\d A-Z]+$/.test(v) ? "ltr" : "rtl"}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={waLink("السلام عليكم، أرغب في طلب عرض سعر للجملة")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 min-h-12 rounded-xl bg-[#F4B41A] text-[#0A182D] font-extrabold touch-manipulation"
            >
              اطلب عرض سعر
              <ArrowLeft className="h-4 w-4" />
            </a>
          </aside>
        </Shell>
      </section>

      {/* ── Journey ── */}
      <section className="bg-[#FBF8F3] py-14 sm:py-24">
        <Shell>
          <SectionTitle
            eyebrow="كيف نعمل"
            title="من طلبك"
            accent="إلى مطبخك"
            lead="خمس خطوات واضحة، تعرف في كل واحدة منها من يتابع طلبك وماذا يحدث له."
          />
          <ol className="relative grid gap-4 sm:gap-5 lg:grid-cols-5">
            {JOURNEY.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-[1.4rem] bg-white border border-[#0E2A47]/10 p-5 sm:p-6 shadow-sm flex lg:flex-col gap-4"
              >
                <div className="flex lg:w-full items-center justify-between gap-3 shrink-0">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0E2A47] text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="hidden lg:block font-brand text-4xl font-black text-[#0E2A47]/10">0{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <p className="lg:hidden text-[11px] font-extrabold text-[#E66A1F]">الخطوة 0{i + 1}</p>
                  <h3 className="font-brand text-lg font-black text-[#0A182D]">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{step.body}</p>
                  <span className="mt-3 inline-block rounded-full bg-[#E66A1F]/10 px-2.5 py-1 text-[11px] font-extrabold text-[#C2410C]">
                    {step.chip}
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm sm:text-base font-bold text-[#0E2A47]">
            نؤكد قبل أن نعد: لا ننشر مدنًا أو مواعيد توصيل قبل تأكيدها معك.
          </p>
        </Shell>
      </section>

      {/* ── Categories ── */}
      <section className="bg-white py-14 sm:py-24">
        <Shell>
          <SectionTitle
            eyebrow="ماذا نورد"
            title={`${CATEGORY_COUNT} قسمًا،`}
            accent="كتالوج واحد"
            lead="كل قسم منشور بأصنافه وعبواته ومواصفاته. اختر القسم وتصفح ما هو متوفر فعلًا."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {catalogCategories.map((c, i) => (
              <Link
                key={c.id}
                to={`/products/${c.slug}`}
                className={`group overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow touch-manipulation ${
                  i < 2 ? "lg:col-span-2" : ""
                }`}
              >
                <div className={`relative overflow-hidden bg-slate-50 aspect-[4/3] ${i < 2 ? "lg:aspect-[16/9]" : ""}`}>
                  <img
                    src={coverFor(c.id)}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-[#0A182D]/85 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {countIn(c.id)} صنف
                  </span>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-brand text-[14px] sm:text-base font-black text-[#0A182D] leading-snug line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="mt-1 hidden sm:block text-xs text-slate-500 leading-relaxed line-clamp-2">{c.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── Sallam exclusive agency ── */}
      <section className="bg-white pb-14 sm:pb-24">
        <Shell>
          <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(145deg,#0A182D_0%,#123049_60%,#0E2A47_100%)] grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[240px] sm:min-h-[340px]">
              <img
                src="/catalog/sallam-feature-grain.jpg"
                alt="أرز سلام المصري"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-10 text-white flex flex-col justify-center">
              <Eyebrow light>وكالة حصرية في السعودية</Eyebrow>
              <h2 className="font-brand text-3xl sm:text-4xl font-black">أرز سلام المصري</h2>
              <p className="mt-3 text-white/80 leading-relaxed text-[15px] sm:text-lg">
                أبيض وكالروز بعبوات 5 و25 كجم للجملة. تسامي الوطنية الوكيل الحصري لأرز سلام في المملكة، فتشتري
                مباشرة من الوكيل دون وسيط.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["سلام أبيض 5 كجم", "سلام أبيض 25 كجم", "سلام كالروز"].map((s) => (
                  <span key={s} className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
              <Link
                to="/products/rice"
                className="mt-7 inline-flex w-fit items-center gap-2 min-h-12 px-6 rounded-xl bg-[#F4B41A] text-[#0A182D] font-extrabold touch-manipulation"
              >
                تصفح قسم الأرز
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Shell>
      </section>

      {/* ── Promise ── */}
      <section className="bg-[#0E2A47] py-14 sm:py-20">
        <Shell className="max-w-[900px] text-center text-white">
          <Quote className="mx-auto h-10 w-10 text-[#F4B41A]" aria-hidden />
          <p className="mt-6 font-brand text-[1.45rem] sm:text-[2.1rem] font-black leading-[1.5]">
            اسم تسامي على عرض السعر وعد. نرسل السعر مكتوبًا، ونؤكد التوصيل قبل أن نعد به، ونورد ما هو موجود فعلًا في
            الكتالوج.
          </p>
          <p className="mt-5 text-sm font-bold text-white/60">مؤسسة تسامي الوطنية</p>
        </Shell>
      </section>

      {/* ── Segments ── */}
      <section className="bg-[#FBF8F3] py-14 sm:py-24">
        <Shell>
          <SectionTitle eyebrow="لمن نعمل" title="شريك توريد" accent="لكل مطبخ ورف" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEGMENTS.map((s) => (
              <Link
                key={s.title}
                to={s.href}
                className="group rounded-[1.4rem] bg-white border border-[#0E2A47]/10 p-6 shadow-sm hover:border-[#E66A1F]/40 transition-colors touch-manipulation"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E66A1F]/10 text-[#E66A1F]">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-brand text-xl font-black text-[#0A182D]">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#15803D]">
                  اعرض الأقسام
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── Comparison ── */}
      <section className="bg-white py-14 sm:py-24">
        <Shell>
          <SectionTitle
            eyebrow="الفرق"
            title="ماذا يتغير عندما"
            accent="تورد من تسامي"
            lead="مقارنة بسيطة بين الشراء المتفرق من عدة موردين، والتوريد من جهة واحدة تجمع أقسام مطبخك."
          />
          <div className="hidden md:block overflow-hidden rounded-[1.4rem] border border-slate-200">
            <table className="w-full text-right text-[15px]">
              <thead>
                <tr className="bg-[#FBF8F3] text-[#0A182D]">
                  <th className="p-4 font-brand font-black w-[24%]">ما تحتاجه</th>
                  <th className="p-4 font-brand font-black text-slate-500 w-[33%]">الشراء المتفرق</th>
                  <th className="p-4 font-brand font-black bg-[#0E2A47] text-white">تسامي الوطنية</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.need} className="border-t border-slate-200">
                    <td className="p-4 font-extrabold text-[#0A182D]">{row.need}</td>
                    <td className="p-4 text-slate-500">{row.scattered}</td>
                    <td className="p-4 font-bold text-[#0E2A47] bg-[#0E2A47]/[0.04]">
                      <span className="inline-flex items-start gap-2">
                        <BadgeCheck className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden />
                        {row.tasami}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-3">
            {COMPARISON.map((row) => (
              <div key={row.need} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-brand font-black text-[#0A182D]">{row.need}</p>
                <p className="mt-2 text-sm text-slate-500">
                  <span className="font-bold">الشراء المتفرق: </span>
                  {row.scattered}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm font-bold text-[#0E2A47]">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden />
                  {row.tasami}
                </p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── Terms ── */}
      <section className="bg-[#FBF8F3] py-14 sm:py-20">
        <Shell>
          <SectionTitle eyebrow="شروط التعامل" title="كل شيء" accent="واضح من البداية" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TERMS.map((t) => (
              <div key={t.title} className="rounded-[1.4rem] bg-white border border-[#0E2A47]/10 p-4 sm:p-6 shadow-sm">
                <t.icon className="h-6 w-6 text-[#E66A1F]" aria-hidden />
                <p className="mt-3 sm:mt-4 font-brand text-2xl sm:text-3xl font-black text-[#0E2A47]">{t.value}</p>
                <h3 className="mt-1 font-brand text-base sm:text-lg font-black text-[#0A182D]">{t.title}</h3>
                <p className="mt-2 text-[13px] sm:text-sm text-slate-600 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── Mission, vision, values ── */}
      <section className="bg-white py-14 sm:py-24">
        <Shell>
          <SectionTitle eyebrow="ما نؤمن به" title="المهمة والرؤية" accent="والقيم" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-[1.4rem] bg-[#0A182D] text-white p-6 sm:p-8">
              <Eyebrow light>مهمتنا</Eyebrow>
              <p className="font-brand text-xl sm:text-2xl font-black leading-relaxed">
                توريد منتجات غذائية بالجملة للمطاعم والأسواق داخل المملكة، بسعر مكتوب وتوصيل مبرد وأصناف واضحة.
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-[#E66A1F] text-white p-6 sm:p-8">
              <p className="flex items-center gap-2.5 text-[11px] sm:text-xs font-extrabold tracking-[0.14em] mb-3 sm:mb-4 text-white/80">
                <span className="h-px w-7 bg-white/80" aria-hidden />
                رؤيتنا
              </p>
              <p className="font-brand text-xl sm:text-2xl font-black leading-relaxed">
                أن نكون المورد الذي تعتمد عليه مطابخ المملكة ورفوفها في كل أقسامها، من مكان واحد.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-[1.4rem] border border-slate-200 bg-[#FBF8F3] p-6">
                <v.icon className="h-6 w-6 text-[#15803D]" aria-hidden />
                <h3 className="mt-4 font-brand text-lg font-black text-[#0A182D]">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white pb-14 sm:pb-24">
        <Shell>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[#15803D] px-6 py-10 sm:px-12 sm:py-14 text-white">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" aria-hidden />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="font-brand text-[1.75rem] sm:text-4xl font-black leading-tight">جاهز تبدأ التوريد؟</h2>
                <p className="mt-3 text-white/85 text-[15px] sm:text-lg leading-relaxed">
                  أرسل الأصناف والكمية والمدينة، ونرسل لك عرض سعر الجملة.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={waLink("السلام عليكم، أرغب في طلب عرض سعر للجملة")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl bg-white text-[#15803D] font-extrabold touch-manipulation"
                >
                  <MessageCircle className="h-5 w-5" />
                  واتساب المبيعات
                </a>
                <Link
                  to="/request"
                  className="inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-xl border-2 border-white/70 text-white font-extrabold touch-manipulation"
                >
                  نموذج طلب التوريد
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* ── Address ── */}
      <section className="bg-[#FBF8F3] py-14 sm:py-20">
        <Shell className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">
          <SectionTitle
            eyebrow="العنوان والتواصل"
            title="مقر واحد،"
            accent="وفريق يرد عليك"
            lead="هذا عنوان السجل التجاري للمؤسسة. مدن التوصيل ومواعيده تُؤكد مع فريق المبيعات حسب الطلب."
          />
          <div className="rounded-[1.4rem] bg-white border border-[#0E2A47]/10 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E66A1F]" aria-hidden />
              <div>
                <p className="font-extrabold text-[#0A182D] leading-relaxed">{LEGAL.address}</p>
                <p className="mt-1 text-sm text-slate-500">
                  الرمز البريدي {LEGAL.postal} · العنوان المختصر {LEGAL.shortAddress}
                </p>
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-[#15803D]"
                >
                  افتح على الخريطة
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </div>
            <a href={`tel:${LEGAL.phoneTel}`} className="flex items-center gap-3 font-extrabold text-[#0A182D]">
              <Phone className="h-5 w-5 text-[#E66A1F]" aria-hidden />
              <span dir="ltr">{LEGAL.phoneDisplay}</span>
            </a>
            <a href={`mailto:${LEGAL.email}`} className="flex items-center gap-3 font-extrabold text-[#0A182D] break-all">
              <Mail className="h-5 w-5 shrink-0 text-[#E66A1F]" aria-hidden />
              {LEGAL.email}
            </a>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <PackageCheck className="h-5 w-5 text-[#E66A1F]" aria-hidden />
              سجل تجاري {LEGAL.cr} · رقم ضريبي {LEGAL.vat}
            </div>
          </div>
        </Shell>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-14 sm:py-24">
        <Shell className="max-w-[900px]">
          <SectionTitle eyebrow="أسئلة شائعة" title="أسئلة عن" accent="تسامي الوطنية" />
          <div className="divide-y divide-slate-200 rounded-[1.4rem] border border-slate-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-brand text-base sm:text-lg font-black text-[#0A182D]">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FBF8F3] text-[#E66A1F] text-xl font-black transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Shell>
      </section>
    </SiteFrame>
  );
}
