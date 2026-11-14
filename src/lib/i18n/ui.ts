import type { Locale } from "./config";

export type Messages = {
  brand: { name: string; accent: string; tagline: string };
  nav: {
    home: string;
    about: string;
    products: string;
    restaurants: string;
    markets: string;
    delivery: string;
    faq: string;
    contact: string;
    cart: string;
    account: string;
    admin: string;
    login: string;
    register: string;
    logout: string;
    openMenu: string;
    closeMenu: string;
    homeAria: string;
    cartAria: string;
  };
  siteFrame: {
    eyebrow: string;
    whatsappCta: string;
    browseProducts: string;
    footerName: string;
    footerAddress: string;
    footerPostal: string;
    footerCr: string;
  };
  catalog: {
    sectionEyebrow: string;
    lockedEyebrow: string;
    allHeading: string;
    allLead: (total: number) => string;
    lockedLead: (count: number) => string;
    searchPlaceholder: string;
    searchResults: string;
    allChip: (n: number) => string;
    noResults: string;
    askWhatsapp: string;
    wholesale: string;
    view: string;
    viewAll: (n: number) => string;
    productCount: (n: number) => string;
    added: string;
    addedLong: string;
    addCart: string;
    addCartShort: string;
    quoteWhatsapp: string;
    requestForm: string;
    previewAria: (title: string) => string;
    quoteAria: (title: string) => string;
    whatsappQuoteIntro: (title: string) => string;
    sallamAgency: string;
    sallamTitle: string;
    sallamBody: string;
    sallamViewRice: string;
    sallamQuote: string;
    viewFullSection: string;
    poultryEyebrow: string;
    poultryTitle: string;
    poultrySubtitle: string;
    poultryQuote: string;
    meatEyebrow: string;
    meatTitle: string;
    meatSubtitle: string;
    meatQuote: string;
    freshEyebrow: string;
    freshTitle: string;
    freshSubtitle: string;
    freshQuote: string;
    frozenEyebrow: string;
    frozenTitle: string;
    frozenSubtitle: string;
    frozenQuote: string;
  };
  home: {
    heroBadge1: string;
    heroBadge2: string;
    heroBadge3: string;
    heroTitle: string;
    heroLead: string;
    heroWhatsapp: string;
    heroProducts: string;
    heroWhatsappMsg: string;
    whyTitle: string;
    whyBody: string;
    crLabel: string;
    vatLabel: string;
    addressLabel: string;
    addressValue: string;
    deliveryLabel: string;
    deliveryLink: string;
    supplyTitle: string;
    supplyLead: string;
    viewPage: string;
    supplyRestaurants: string;
    supplyCafes: string;
    supplyHotels: string;
    supplyMarkets: string;
    scrollHint: string;
    scrollSteps: string;
    scrollReasons: string;
    scrollTestimonials: string;
    certEyebrow: string;
    certTitle: string;
    certLead: string;
    processEyebrow: string;
    processTitle: string;
    reasonsEyebrow: string;
    reasonsTitle: string;
    deliveryTitle: string;
    deliveryLead: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    contactEyebrow: string;
    contactTitle: string;
    contactWhatsapp: string;
    contactWhatsappMsg: string;
    footerTagline: string;
    footerRights: string;
    stats: { value: string; label: string }[];
    certifications: { title: string; desc: string }[];
    miniCards: { title: string; desc: string }[];
    processSteps: { num: string; title: string; desc: string }[];
    reasons: string[];
  };
  about: {
    pageTitle: string;
    metaDescription: (products: number, categories: number) => string;
    eyebrow: string;
    heroTitle: string;
    heroAccent: string;
    heroLead: string;
    heroBody: (founded: string, products: number, categories: number) => string;
    whatsappCta: string;
    browseCatalog: string;
    whatsappMsg: string;
    statFounded: string;
    statCategories: string;
    statProducts: string;
    statBrands: string;
  };
};

const ar: Messages = {
  brand: {
    name: "تسامي",
    accent: "الوطنية",
    tagline: "توريدات الجملة للمطاعم والأسواق",
  },
  nav: {
    home: "الرئيسية",
    about: "من نحن",
    products: "المنتجات",
    restaurants: "المطاعم",
    markets: "الأسواق",
    delivery: "التوصيل",
    faq: "الأسئلة",
    contact: "تواصل",
    cart: "السلة",
    account: "حسابي",
    admin: "لوحة التحكم",
    login: "دخول",
    register: "إنشاء حساب",
    logout: "خروج",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    homeAria: "تسامي الوطنية — الصفحة الرئيسية",
    cartAria: "سلة المشتريات",
  },
  siteFrame: {
    eyebrow: "مؤسسة تسامي الوطنية",
    whatsappCta: "اطلب عرض سعر على واتساب",
    browseProducts: "عرض المنتجات",
    footerName: "مؤسسة تسامي الوطنية",
    footerAddress: "ينبع، حي الحدائق، شارع الملك عبدالعزيز ابن عبدالرحمن سعود، مبنى 2452",
    footerPostal: "الرمز البريدي 46429 · العنوان المختصر YADB2452",
    footerCr: "السجل التجاري 7051037930 · الرقم الضريبي 314091043600003",
  },
  catalog: {
    sectionEyebrow: "كتالوج الجملة",
    lockedEyebrow: "قسم من الكتالوج",
    allHeading: "أقسام المنتجات بالجملة",
    allLead: (total) => `${total} صنفاً — أضف للسلة للطلب الأونلاين أو اطلب تسعيرة فورية.`,
    lockedLead: (count) => `${count} منتج في هذا القسم. أضف للسلة أو اطلب تسعيرة.`,
    searchPlaceholder: "ابحث باسم المنتج أو الماركة...",
    searchResults: "نتائج البحث",
    allChip: (n) => `الكل (${n})`,
    noResults: "لا توجد نتائج مطابقة. جرّب قسمًا قريبًا أو اسأل فريق المبيعات.",
    askWhatsapp: "اسأل عن المنتج على واتساب",
    wholesale: "جملة",
    view: "عرض",
    viewAll: (n) => `عرض الكل (${n})`,
    productCount: (n) => `${n} منتج`,
    added: "تمت",
    addedLong: "تمت الإضافة",
    addCart: "أضف للسلة",
    addCartShort: "للسلة",
    quoteWhatsapp: "طلب تسعيرة واتساب",
    requestForm: "طلب عبر النموذج",
    previewAria: (title) => `عرض ${title}`,
    quoteAria: (title) => `طلب تسعيرة ${title} على واتساب`,
    whatsappQuoteIntro: (title) => `السلام عليكم، أرغب في طلب تسعيرة لمنتج: ${title}`,
    sallamAgency: "وكالة حصرية · تسامي الوطنية",
    sallamTitle: "أرز سلام المصري",
    sallamBody: "أبيض وكالروز بعبوات 5 و25 كجم للجملة. تسامي الوطنية الوكيل الحصري في السعودية.",
    sallamViewRice: "اعرض في قسم الأرز",
    sallamQuote: "اطلب تسعيرة سلام",
    viewFullSection: "اعرض القسم كامل",
    poultryEyebrow: "مبرد · طازج يومي",
    poultryTitle: "الدجاج المبرد والمجمد",
    poultrySubtitle: "دجاج كامل مبرد، صدور بدون جلد أو عظم، ودجاج مجمد — من ماركات سعودية متعددة بالجملة.",
    poultryQuote: "اطلب تسعيرة الدجاج",
    meatEyebrow: "لحوم · مبرد ومجمد",
    meatTitle: "اللحوم المبردة والمجمدة",
    meatSubtitle: "خروف مبرد، وقطعيات لحم حمراء بدون عظم: سيلفرسايد، كنكلز، ثيك فلانك، وقطع الرجل.",
    meatQuote: "اطلب تسعيرة اللحوم",
    freshEyebrow: "طازج · تصوير احترافي",
    freshTitle: "المنتجات الطازجة",
    freshSubtitle: "برتقال، رمان، ليمون أضاليا، طماطم، بصل، بطاطس، ثوم، تمور، بروكلي، قرنبيط، وكرنب.",
    freshQuote: "اطلب تسعيرة الطازج",
    frozenEyebrow: "مجمد · جودة بريميوم",
    frozenTitle: "المنتجات المجمدة",
    frozenSubtitle:
      "بطاطس نصف مقلية، خضار مشكل، فاصوليا، بسلة سكري، بامية إكسترا، بروكلي، ذرة، ملوخية، فول فص، سبانخ، فراولة، مانجو، رمان حب، جوافة، وبرتقال مجمد.",
    frozenQuote: "اطلب تسعيرة المجمد",
  },
  home: {
    heroBadge1: "توريد دواجن حلال",
    heroBadge2: "أغذية سعودية",
    heroBadge3: "سجل تجاري 7051037930",
    heroTitle: "منتجات غذائية بالجملة للمطاعم والأسواق",
    heroLead:
      "نورد الدواجن المبردة، البطاطس المجمدة، والبيض الطازج للمطاعم والأسواق، مع توصيل مبرد. اطلب عرض السعر الآن.",
    heroWhatsapp: "طلب عرض سعر",
    heroProducts: "عرض المنتجات",
    heroWhatsappMsg: "السلام عليكم، أرغب في طلب عرض سعر للجملة",
    whyTitle: "لماذا تختارنا؟",
    whyBody:
      "نورد الدواجن والبطاطس والبيض وباقي أقسام الكتالوج للمطاعم والأسواق. عرض السعر يُرسل بعد تحديد الكمية والمدينة.",
    crLabel: "السجل التجاري",
    vatLabel: "الرقم الضريبي",
    addressLabel: "عنوان المنشأة",
    addressValue: "ينبع · YADB2452",
    deliveryLabel: "التوصيل",
    deliveryLink: "مبرد، حسب المدينة",
    supplyTitle: "لمن نورّد",
    supplyLead: "اختر نوع نشاطك. الأقسام المعروضة هي الموجودة في الكتالوج فقط.",
    viewPage: "اعرض الصفحة",
    supplyRestaurants: "مطاعم",
    supplyCafes: "كافيهات ومخابز",
    supplyHotels: "فنادق وتموين",
    supplyMarkets: "أسواق وبقالات",
    scrollHint: "اسحب للتصفح ←",
    scrollSteps: "اسحب لخطوات التوريد ←",
    scrollReasons: "اسحب للأسباب ←",
    scrollTestimonials: "اسحب لآراء العملاء ←",
    certEyebrow: "الامتثال والشهادات",
    certTitle: "معايير الغذاء والجودة",
    certLead: "نلتزم بمعايير سلامة الأغذية والوثائق المصاحبة لكل توريد.",
    processEyebrow: "مسار التوريد",
    processTitle: "من الاستفسار إلى التوصيل",
    reasonsEyebrow: "مزايا التعامل",
    reasonsTitle: "أسباب اختيار تسامي الوطنية",
    deliveryTitle: "التوصيل المبرد",
    deliveryLead: "شحن مباشر إلى مستودعك أو مطبخك ضمن سلاسل تبريد موثوقة.",
    testimonialsEyebrow: "آراء العملاء",
    testimonialsTitle: "يثقون بنا في التوريد",
    faqEyebrow: "أسئلة شائعة",
    faqTitle: "إجابات سريعة عن الجملة والتوصيل",
    contactEyebrow: "تواصل",
    contactTitle: "ابدأ طلب الجملة الآن",
    contactWhatsapp: "واتساب فوري",
    contactWhatsappMsg: "السلام عليكم، أرغب في الاستفسار عن توريد الجملة",
    footerTagline: "توريد أغذية بالجملة — ينبع والمملكة",
    footerRights: "جميع الحقوق محفوظة",
    stats: [
      { value: "10+", label: "سنوات في توريد الدواجن والأغذية" },
      { value: "500+", label: "عميل راضٍ في أنحاء المملكة" },
      { value: "100%", label: "منتجات حلال ومعتمدة" },
      { value: "24/7", label: "سلاسل إمداد مبردة ولوجستيات" },
    ],
    certifications: [
      {
        title: "حلال Halal",
        desc: "مصانع معتمدة ومطابقة لمواصفات الغذاء والدواء والجهات الإسلامية.",
      },
      {
        title: "نظام الهاسب HACCP",
        desc: "تحليل المخاطر ونقاط التحكم الحرجة في كل مرحلة إنتاج.",
      },
      {
        title: "أيزو ISO 22000",
        desc: "المعيار العالمي لإدارة سلامة الأغذية.",
      },
      {
        title: "هيئة الغذاء والدواء",
        desc: "امتثال كامل لاشتراطات SFDA في المملكة العربية السعودية.",
      },
      {
        title: "سلاسل التبريد",
        desc: "نقل وتخزين في درجة التبريد المناسبة للحفاظ على الجودة.",
      },
    ],
    miniCards: [
      { title: "المهمة", desc: "توريد منتجات غذائية بالجملة للمطاعم والأسواق." },
      { title: "التركيز الإقليمي", desc: "توريد للمطاعم والأسواق داخل المملكة العربية السعودية." },
      { title: "الجودة", desc: "نراجع الشهادات والوثائق المصاحبة للتوريد." },
      { title: "اللوجستيات", desc: "سلاسل إمداد مبردة موثوقة من أرض المصدر إلى وجهتك." },
    ],
    processSteps: [
      { num: "01", title: "تقديم الاستفسار", desc: "شاركنا المنتج المطلوب، الكميات، والمدينة." },
      { num: "02", title: "استلام التسعيرة", desc: "نراجع الطلب ونرسل عرض السعر للجملة." },
      { num: "03", title: "الجودة والوثائق", desc: "الفحص، الشهادات، وتجهيز الوثائق." },
      { num: "04", title: "التعبئة والتبريد", desc: "تغليف آمن ضمن سلاسل مبردة." },
      { num: "05", title: "التوصيل السريع", desc: "شحن مباشر إلى مستودعاتك أو مطعمك." },
    ],
    reasons: [
      "منتجات غذائية بالجملة للمطاعم والأسواق",
      "عرض سعر للجملة بعد مراجعة الكمية والمدينة",
      "لوجستيات توريد موثوقة ومجدولة بدقة",
      "تغليف مرن وتعبئة مخصصة حسب الطلب",
      "الامتثال الصارم لمعايير الغذاء والدواء (SFDA)",
      "فريق دعم مخصص لخدمة عملاء الجملة والتوريد",
      "توثيق كامل لجميع الشحنات لضمان الشفافية",
      "أسطول مبرد متكامل لتوصيل آمن وسريع",
    ],
  },
  about: {
    pageTitle: "من نحن | مؤسسة تسامي الوطنية لتوريد الأغذية بالجملة",
    metaDescription: (products, categories) =>
      `مؤسسة تسامي الوطنية، ينبع: توريد أغذية بالجملة للمطاعم والفنادق والأسواق. ${products} صنفًا في ${categories} قسمًا، توصيل مبرد، والوكيل الحصري لأرز سلام في السعودية.`,
    eyebrow: "عن مؤسسة تسامي الوطنية",
    heroTitle: "مورد أغذية بالجملة",
    heroAccent: "للمطاعم والأسواق",
    heroLead: "أصناف واضحة، عرض سعر مكتوب، وتوصيل مبرد حتى مطبخك.",
    heroBody: (founded, products, categories) =>
      `مؤسسة تسامي الوطنية منشأة سعودية تأسست عام ${founded}، مسجلة في ينبع، تورد منتجات غذائية بالجملة للمطاعم والكافيهات والمخابز والفنادق وشركات التموين والأسواق والبقالات داخل المملكة. يضم كتالوجنا ${products} صنفًا في ${categories} قسمًا، ونحن الوكيل الحصري لأرز سلام المصري في السعودية.`,
    whatsappCta: "اطلب عرض سعر على واتساب",
    browseCatalog: "تصفح الكتالوج",
    whatsappMsg: "السلام عليكم، أرغب في الاستفسار عن توريد الجملة من تسامي الوطنية",
    statFounded: "سنة التأسيس",
    statCategories: "قسمًا في الكتالوج",
    statProducts: "صنفًا للجملة",
    statBrands: "علامة تجارية نوردها",
  },
};

const ur: Messages = {
  ...ar,
  brand: {
    name: "تسامی",
    accent: "الوطنیہ",
    tagline: "ریستورانوں اور منڈیوں کے لیے تھوک سپلائی",
  },
  nav: {
    home: "ہوم",
    about: "ہمارے بارے میں",
    products: "مصنوعات",
    restaurants: "ریستوران",
    markets: "منڈیاں",
    delivery: "ڈیلیوری",
    faq: "سوالات",
    contact: "رابطہ",
    cart: "ٹوکری",
    account: "میرا اکاؤنٹ",
    admin: "ایڈمن پینل",
    login: "لاگ ان",
    register: "اکاؤنٹ بنائیں",
    logout: "لاگ آؤٹ",
    openMenu: "مینو کھولیں",
    closeMenu: "مینو بند کریں",
    homeAria: "تسامی الوطنیہ — ہوم پیج",
    cartAria: "خریداری کی ٹوکری",
  },
  siteFrame: {
    eyebrow: "ادارہ تسامی الوطنیہ",
    whatsappCta: "واٹس ایپ پر قیمت طلب کریں",
    browseProducts: "مصنوعات دیکھیں",
    footerName: "ادارہ تسامی الوطنیہ",
    footerAddress:
      "ینبع، محلے الحدائق، شاہ عبدالعزیز کی سڑک، عمارت 2452",
    footerPostal: "پوسٹ کوڈ 46429 · مختصر پتہ YADB2452",
    footerCr: "تجارتی رجسٹر 7051037930 · ٹیکس نمبر 314091043600003",
  },
  catalog: {
    ...ar.catalog,
    sectionEyebrow: "تھوک کیٹلاگ",
    lockedEyebrow: "کیٹلاگ کا سیکشن",
    allHeading: "تھوک مصنوعات کے شعبے",
    allLead: (total) =>
      `${total} اقسام — آن لائن آرڈر کے لیے ٹوکری میں شامل کریں یا فوری قیمت مانگیں۔`,
    lockedLead: (count) => `${count} مصنوعات اس شعبے میں۔ ٹوکری میں شامل کریں یا قیمت مانگیں۔`,
    searchPlaceholder: "مصنوعات یا برانڈ کے نام سے تلاش کریں...",
    searchResults: "تلاش کے نتائج",
    allChip: (n) => `سب (${n})`,
    noResults: "کوئی نتیجہ نہیں۔ قریبی شعبہ آزمائیں یا سیلز ٹیم سے پوچھیں۔",
    askWhatsapp: "واٹس ایپ پر پوچھیں",
    wholesale: "تھوک",
    view: "دیکھیں",
    viewAll: (n) => `سب دیکھیں (${n})`,
    productCount: (n) => `${n} مصنوعات`,
    added: "شامل",
    addedLong: "شامل ہو گیا",
    addCart: "ٹوکری میں شامل",
    addCartShort: "ٹوکری",
    quoteWhatsapp: "واٹس ایپ قیمت",
    requestForm: "فارم سے درخواست",
    previewAria: (title) => `${title} دیکھیں`,
    quoteAria: (title) => `${title} کی قیمت واٹس ایپ پر`,
    whatsappQuoteIntro: (title) => `السلام علیکم، مجھے اس کی قیمت چاہیے: ${title}`,
    sallamAgency: "خصوصی ایجنسی · تسامی الوطنیہ",
    sallamTitle: "مصری سلام چاول",
    sallamBody:
      "سفید اور کیلروز 5 اور 25 کلو تھوک پیکٹ میں۔ تسامی الوطنیہ سعودی عرب میں خصوصی ایجنٹ۔",
    sallamViewRice: "چاول کے شعبے میں دیکھیں",
    sallamQuote: "سلام کی قیمت",
    viewFullSection: "پورا شعبہ دیکھیں",
    poultryEyebrow: "ٹھنڈا · روزانہ تازہ",
    poultryTitle: "ٹھنڈا اور منجمد چکن",
    poultrySubtitle:
      "ٹھنڈا مکمل چکن، بغیر جلد/ہڈی سینہ، منجمد چکن — کئی سعودی برانڈز تھوک میں۔",
    poultryQuote: "چکن کی قیمت",
    meatEyebrow: "گوشت · ٹھنڈا و منجمد",
    meatTitle: "ٹھنڈا اور منجمد گوشت",
    meatSubtitle: "ٹھنڈی بکری اور بغیر ہڈی سرخ گوشت کے ٹکڑے۔",
    meatQuote: "گوشت کی قیمت",
    freshEyebrow: "تازہ · پریمیم فوٹو",
    freshTitle: "تازہ مصنوعات",
    freshSubtitle: "سنگترہ، انار، لیمو، ٹماٹر، پیاز، آلو، لہسن، کھجور، سبزیاں وغیرہ۔",
    freshQuote: "تازہ کی قیمت",
    frozenEyebrow: "منجمد · پریمیم",
    frozenTitle: "منجمد مصنوعات",
    frozenSubtitle: "ہاف فرائی آلو، مخلوط سبزیاں، سیم، مٹر، بھنڈی، پھل وغیرہ۔",
    frozenQuote: "منجمد کی قیمت",
  },
  home: {
    ...ar.home,
    heroBadge1: "حلال چکن سپلائی",
    heroBadge2: "سعودی فوڈ",
    heroBadge3: "تجارتی رجسٹر 7051037930",
    heroTitle: "ریستورانوں اور منڈیوں کے لیے تھوک غذائی مصنوعات",
    heroLead:
      "ہم ریستورانوں اور منڈیوں کو ٹھنڈا چکن، منجمد آلو اور تازہ انڈے فراہم کرتے ہیں، ٹھنڈی ڈیلیوری کے ساتھ۔ ابھی قیمت مانگیں۔",
    heroWhatsapp: "قیمت مانگیں",
    heroProducts: "مصنوعات دیکھیں",
    heroWhatsappMsg: "السلام علیکم، مجھے تھوک کی قیمت چاہیے",
    whyTitle: "ہمیں کیوں منتخب کریں؟",
    whyBody:
      "ہم چکن، آلو، انڈے اور باقی کیٹلاگ ریستورانوں و منڈیوں کو فراہم کرتے ہیں۔ مقدار اور شہر طے ہونے پر قیمت بھیجی جاتی ہے۔",
    crLabel: "تجارتی رجسٹر",
    vatLabel: "ٹیکس نمبر",
    addressLabel: "پتہ",
    addressValue: "ینبع · YADB2452",
    deliveryLabel: "ڈیلیوری",
    deliveryLink: "ٹھنڈی، شہر کے مطابق",
    supplyTitle: "ہم کس کو سپلائی کرتے ہیں",
    supplyLead: "اپنی سرگرمی منتخب کریں۔ دکھائے گئے شعبے کیٹلاگ میں موجود ہیں۔",
    viewPage: "صفحہ دیکھیں",
    supplyRestaurants: "ریستوران",
    supplyCafes: "کیفے اور بیکری",
    supplyHotels: "ہوٹل اور کیٹرنگ",
    supplyMarkets: "منڈیاں اور دکانیں",
    scrollHint: "دیکھنے کے لیے سوائپ کریں ←",
    scrollSteps: "مراحل دیکھنے کے لیے سوائپ ←",
    scrollReasons: "وجوہات دیکھنے کے لیے سوائپ ←",
    scrollTestimonials: "آراء دیکھنے کے لیے سوائپ ←",
    certEyebrow: "تعمیل اور سرٹیفکیٹ",
    certTitle: "غذا اور معیار کے معیارات",
    certLead: "ہم ہر سپلائی کے ساتھ سلامت اور دستاویزات کی پاسداری کرتے ہیں۔",
    processEyebrow: "سپلائی کا راستہ",
    processTitle: "پوچھ گچھ سے ڈیلیوری تک",
    reasonsEyebrow: "فوائد",
    reasonsTitle: "تسامی الوطنیہ کیوں",
    deliveryTitle: "ٹھنڈی ڈیلیوری",
    deliveryLead: "آپ کے گودام یا باورچی خانے تک براہ راست ٹھنڈی چین میں۔",
    testimonialsEyebrow: "گاہکوں کی رائے",
    testimonialsTitle: "سپلائی پر اعتماد",
    faqEyebrow: "عام سوالات",
    faqTitle: "تھوک اور ڈیلیوری کے جوابات",
    contactEyebrow: "رابطہ",
    contactTitle: "تھوک آرڈر شروع کریں",
    contactWhatsapp: "فوری واٹس ایپ",
    contactWhatsappMsg: "السلام علیکم، تھوک سپلائی کے بارے میں پوچھنا ہے",
    footerTagline: "تھوک غذا — ینبع اور مملکت",
    footerRights: "جملہ حقوق محفوظ",
    stats: [
      { value: "10+", label: "چکن اور غذا کی سپلائی میں سال" },
      { value: "500+", label: "خوش گاہک پوری مملکت میں" },
      { value: "100%", label: "حلال اور تصدیق شدہ مصنوعات" },
      { value: "24/7", label: "ٹھنڈی سپلائی چین اور لاجسٹکس" },
    ],
    certifications: [
      { title: "حلال Halal", desc: "تصدیق شدہ فیکٹریاں اور اسلامی معیارات۔" },
      { title: "HACCP", desc: "ہر مرحلے پر خطرے کا تجزیہ اور کنٹرول۔" },
      { title: "ISO 22000", desc: "عالمی غذا کی حفاظت کا معیار۔" },
      { title: "SFDA", desc: "سعودی فوڈ اتھارٹی کی مکمل تعمیل۔" },
      { title: "ٹھنڈی چین", desc: "معیار کے لیے مناسب درجہ حرارت پر نقل و حفظ。" },
    ],
    miniCards: [
      { title: "مشن", desc: "ریستورانوں اور منڈیوں کو تھوک غذا۔" },
      { title: "علاقائی فوکس", desc: "سعودی عرب میں سپلائی。" },
      { title: "معیار", desc: "ہر سپلائی کے ساتھ دستاویزات کی جانچ。" },
      { title: "لاجسٹکس", desc: "ماخذ سے منزل تک قابلِ اعتماد ٹھنڈی سپلائی چین۔" },
    ],
    processSteps: [
      { num: "01", title: "استفسار", desc: "مصنوع، مقدار اور شہر بتائیں。" },
      { num: "02", title: "قیمت", desc: "جائزے کے بعد تھوک کی پیشکش。" },
      { num: "03", title: "معیار", desc: "جانچ، سرٹیفکیٹ، دستاویزات。" },
      { num: "04", title: "پیکنگ", desc: "ٹھنڈی چین میں محفوظ پیکنگ。" },
      { num: "05", title: "ڈیلیوری", desc: "براہ راست آپ کے دروازے تک。" },
    ],
    reasons: [
      "ریستورانوں اور منڈیوں کے لیے تھوک غذا",
      "مقدار اور شہر کے بعد قیمت",
      "قابل اعتماد اور بروقت لاجسٹکس",
      "لچکدار پیکنگ",
      "SFDA کے سخت معیارات",
      "مختص تھوک سپورٹ ٹیم",
      "ہر شپمنٹ کی مکمل دستاویز",
      "مکمل ٹھنڈا فلیٹ",
    ],
  },
  about: {
    pageTitle: "ہمارے بارے میں | تسامی الوطنیہ تھوک غذا",
    metaDescription: (products, categories) =>
      `تسامی الوطنیہ ینبع: ریستورانوں، ہوٹلوں اور منڈیوں کو تھوک غذا۔ کیٹلاگ میں ${products} اقسام، ${categories} شعبے، ٹھنڈی ڈیلیوری، سلام چاول کا خصوصی ایجنٹ۔`,
    eyebrow: "تسامی الوطنیہ کے بارے میں",
    heroTitle: "تھوک غذا کا سپلائر",
    heroAccent: "ریستورانوں اور منڈیوں کے لیے",
    heroLead: "واضح اقسام، تحریری قیمت، آپ کے باورچی خانے تک ٹھنڈی ڈیلیوری۔",
    heroBody: (founded, products, categories) =>
      `تسامی الوطنیہ ایک سعودی ادارہ ہے (بنانے کا سال ${founded})، ینبع میں رجسٹرڈ۔ ہم ریستوران، کیفے، ہوٹل، کیٹرنگ اور منڈیوں کو تھوک غذا فراہم کرتے ہیں۔ کیٹلاگ میں ${products} اقسام اور ${categories} شعبے ہیں؛ ہم مصر کے سلام چاول کے خصوصی ایجنٹ ہیں۔`,
    whatsappCta: "واٹس ایپ پر قیمت مانگیں",
    browseCatalog: "کیٹلاگ دیکھیں",
    whatsappMsg: "السلام علیکم، تسامی الوطنیہ سے تھوک سپلائی کے بارے میں پوچھنا ہے",
    statFounded: "سال قیام",
    statCategories: "کیٹلاگ شعبے",
    statProducts: "تھوک اقسام",
    statBrands: "برانڈز",
  },
};

const hi: Messages = {
  ...ar,
  brand: {
    name: "तसामी",
    accent: "अलवतनिया",
    tagline: "रेस्तरां और बाज़ारों के लिए थोक आपूर्ति",
  },
  nav: {
    home: "होम",
    about: "हमारे बारे में",
    products: "उत्पाद",
    restaurants: "रेस्तरां",
    markets: "बाज़ार",
    delivery: "डिलीवरी",
    faq: "प्रश्न",
    contact: "संपर्क",
    cart: "कार्ट",
    account: "मेरा खाता",
    admin: "एडमिन पैनल",
    login: "लॉग इन",
    register: "खाता बनाएँ",
    logout: "लॉग आउट",
    openMenu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    homeAria: "तसामी अलवतनिया — होम पेज",
    cartAria: "खरीदारी कार्ट",
  },
  siteFrame: {
    eyebrow: "तसामी अलवतनिया प्रतिष्ठान",
    whatsappCta: "व्हाट्सऐप पर कीमत माँगें",
    browseProducts: "उत्पाद देखें",
    footerName: "तसामी अलवतनिया प्रतिष्ठान",
    footerAddress:
      "यानबु, अल-हदाईक़, किंग अब्दुलअज़ीज़ सड़क, इमारत 2452",
    footerPostal: "पिन 46429 · संक्षिप्त पता YADB2452",
    footerCr: "व्यापार रजिस्टर 7051037930 · कर संख्या 314091043600003",
  },
  catalog: {
    ...ar.catalog,
    sectionEyebrow: "थोक कैटलॉग",
    lockedEyebrow: "कैटलॉग अनुभाग",
    allHeading: "थोक उत्पाद श्रेणियाँ",
    allLead: (total) =>
      `${total} वस्तुएँ — ऑनलाइन ऑर्डर के लिए कार्ट में डालें या तुरंत कीमत माँगें।`,
    lockedLead: (count) => `${count} उत्पाद इस अनुभाग में। कार्ट या कीमत।`,
    searchPlaceholder: "उत्पाद या ब्रांड नाम से खोजें...",
    searchResults: "खोज परिणाम",
    allChip: (n) => `सभी (${n})`,
    noResults: "कोई परिणाम नहीं। नज़दीकी श्रेणी आज़माएँ या सेल्स से पूछें।",
    askWhatsapp: "व्हाट्सऐप पर पूछें",
    wholesale: "थोक",
    view: "देखें",
    viewAll: (n) => `सभी देखें (${n})`,
    productCount: (n) => `${n} उत्पाद`,
    added: "जोड़ा",
    addedLong: "कार्ट में जोड़ा गया",
    addCart: "कार्ट में डालें",
    addCartShort: "कार्ट",
    quoteWhatsapp: "व्हाट्सऐप कीमत",
    requestForm: "फ़ॉर्म से अनुरोध",
    previewAria: (title) => `${title} देखें`,
    quoteAria: (title) => `${title} की कीमत व्हाट्सऐप पर`,
    whatsappQuoteIntro: (title) => `नमस्ते, मुझे इसकी कीमत चाहिए: ${title}`,
    sallamAgency: "विशेष एजेंसी · तसामी अलवतनिया",
    sallamTitle: "मिस्री सलाम चावल",
    sallamBody:
      "सफ़ेद और कैलरोज़ 5 व 25 किग्रा थोक पैक। सऊदी अरब में विशेष एजेंट।",
    sallamViewRice: "चावल अनुभाग में देखें",
    sallamQuote: "सलाम की कीमत",
    viewFullSection: "पूरा अनुभाग देखें",
    poultryEyebrow: "ठंडा · रोज़ाना ताज़ा",
    poultryTitle: "ठंडा और जमे चिकन",
    poultrySubtitle: "ठंडा पूरा चिकन, हड्डी-रहित छाती, जमे चिकन — कई सऊदी ब्रांड थोक में।",
    poultryQuote: "चिकन की कीमत",
    meatEyebrow: "मांस · ठंडा व जमा",
    meatTitle: "ठंडा और जमे मांस",
    meatSubtitle: "ठंडी भेड़ और हड्डी रहित लाल मांस के टुकड़े।",
    meatQuote: "मांस की कीमत",
    freshEyebrow: "ताज़ा · प्रीमियम फोटो",
    freshTitle: "ताज़े उत्पाद",
    freshSubtitle: "संतरा, अनार, नींबू, टमाटर, प्याज, आलू, लहसुन, खजूर, सब्ज़ियाँ आदि।",
    freshQuote: "ताज़ा की कीमत",
    frozenEyebrow: "जमा · प्रीमियम",
    frozenTitle: "जमे उत्पाद",
    frozenSubtitle: "हाफ फ्राइ आलू, मिश्रित सब्ज़ियाँ, बीन्स, मटर, भिंडी, फल आदि।",
    frozenQuote: "फ्रोजन की कीमत",
  },
  home: {
    ...ar.home,
    heroBadge1: "हलाल चिकन आपूर्ति",
    heroBadge2: "सऊदी खाद्य",
    heroBadge3: "व्यापार रजिस्टर 7051037930",
    heroTitle: "रेस्तरां और बाज़ारों के लिए थोक खाद्य उत्पाद",
    heroLead:
      "हम रेस्तरां और बाज़ारों को ठंडा चिकन, जमे आलू और ताज़े अंडे देते हैं, ठंडी डिलीवरी के साथ। अभी कीमत माँगें।",
    heroWhatsapp: "कीमत माँगें",
    heroProducts: "उत्पाद देखें",
    heroWhatsappMsg: "नमस्ते, मुझे थोक की कीमत चाहिए",
    whyTitle: "हमें क्यों चुनें?",
    whyBody:
      "हम चिकन, आलू, अंडे और बाकी कैटलॉग रेस्तरां व बाज़ारों को देते हैं। मात्रा और शहर तय होने पर कीमत भेजी जाती है।",
    crLabel: "व्यापार रजिस्टर",
    vatLabel: "कर संख्या",
    addressLabel: "पता",
    addressValue: "यानबु · YADB2452",
    deliveryLabel: "डिलीवरी",
    deliveryLink: "ठंडी, शहर के अनुसार",
    supplyTitle: "हम किसे सप्लाई करते हैं",
    supplyLead: "अपनी गतिविधि चुनें। दिखाए गए अनुभाग कैटलॉग में हैं।",
    viewPage: "पेज देखें",
    supplyRestaurants: "रेस्तरां",
    supplyCafes: "कैफ़े और बेकरी",
    supplyHotels: "होटल और कैटरिंग",
    supplyMarkets: "बाज़ार और दुकानें",
    scrollHint: "देखने के लिए स्वाइप करें →",
    scrollSteps: "चरण देखने स्वाइप →",
    scrollReasons: "कारण देखने स्वाइप →",
    scrollTestimonials: "राय देखने स्वाइप →",
    certEyebrow: "अनुपालन और प्रमाणपत्र",
    certTitle: "खाद्य और गुणवत्ता मानक",
    certLead: "हम हर आपूर्ति के साथ सुरक्षा और दस्तावेज़ सुनिश्चित करते हैं।",
    processEyebrow: "आपूर्ति मार्ग",
    processTitle: "पूछताछ से डिलीवरी तक",
    reasonsEyebrow: "फ़ायदे",
    reasonsTitle: "तसामी अलवतनिया क्यों",
    deliveryTitle: "ठंडी डिलीवरी",
    deliveryLead: "आपके गोदाम या रसोई तक सीधी ठंडी श्रृंखला में।",
    testimonialsEyebrow: "ग्राहकों की राय",
    testimonialsTitle: "आपूर्ति पर भरोसा",
    faqEyebrow: "अक्सर पूछे जाने वाले",
    faqTitle: "थोक और डिलीवरी के जवाब",
    contactEyebrow: "संपर्क",
    contactTitle: "थोक ऑर्डर शुरू करें",
    contactWhatsapp: "तुरंत व्हाट्सऐप",
    contactWhatsappMsg: "नमस्ते, थोक आपूर्ति के बारे में पूछना है",
    footerTagline: "थोक खाद्य — यानबु और सऊदी",
    footerRights: "सर्वाधिकार सुरक्षित",
    stats: [
      { value: "10+", label: "चिकन और खाद्य आपूर्ति में वर्ष" },
      { value: "500+", label: "खुश ग्राहक पूरे राज्य में" },
      { value: "100%", label: "हलाल प्रमाणित उत्पाद" },
      { value: "24/7", label: "ठंडी श्रृंखला और लॉजिस्टिक्स" },
    ],
    certifications: [
      { title: "हलाल Halal", desc: "प्रमाणित कारखाने और इस्लामी मानक।" },
      { title: "HACCP", desc: "हर चरण पर जोखिम विश्लेषण।" },
      { title: "ISO 22000", desc: "वैश्विक खाद्य सुरक्षा मानक।" },
      { title: "SFDA", desc: "सऊदी फ़ूड अथॉरिटी का पालन।" },
      { title: "ठंडी श्रृंखला", desc: "गुणवत्ता के लिए सही तापमान।" },
    ],
    miniCards: [
      { title: "उद्देश्य", desc: "रेस्तरां और बाज़ारों को थोक खाद्य।" },
      { title: "क्षेत्रीय फोकस", desc: "सऊदी अरब के भीतर आपूर्ति।" },
      { title: "गुणवत्ता", desc: "हर आपूर्ति के साथ दस्तावेज़ जाँच।" },
      { title: "लॉजिस्टिक्स", desc: "स्रोत से गंतव्य तक ठंडी श्रृंखला।" },
    ],
    processSteps: [
      { num: "01", title: "पूछताछ", desc: "उत्पाद, मात्रा और शहर बताएँ।" },
      { num: "02", title: "कीमत", desc: "जाँच के बाद थोक प्रस्ताव।" },
      { num: "03", title: "गुणवत्ता", desc: "जाँच, प्रमाणपत्र, दस्तावेज़।" },
      { num: "04", title: "पैकिंग", desc: "ठंडी श्रृंखला में सुरक्षित पैकिंग।" },
      { num: "05", title: "डिलीवरी", desc: "सीधे आपके द्वार तक।" },
    ],
    reasons: [
      "रेस्तरां और बाज़ारों के लिए थोक खाद्य",
      "मात्रा और शहर के बाद कीमत",
      "विश्वसनीय समयबद्ध लॉजिस्टिक्स",
      "लचीली पैकिंग",
      "SFDA के कड़े मानक",
      "समर्पित थोक सपोर्ट टीम",
      "हर शिपमेंट का पूरा दस्तावेज़",
      "पूर्ण ठंडा फ्लीट",
    ],
  },
  about: {
    pageTitle: "हमारे बारे में | तसामी अलवतनिया थोक खाद्य",
    metaDescription: (products, categories) =>
      `तसामी अलवतनिया यानबु: रेस्तरां, होटल और बाज़ारों को थोक खाद्य। कैटलॉग में ${products} वस्तुएँ, ${categories} श्रेणियाँ, ठंडी डिलीवरी, सलाम चावल विशेष एजेंसी।`,
    eyebrow: "तसामी अलवतनिया के बारे में",
    heroTitle: "थोक खाद्य आपूर्तिकर्ता",
    heroAccent: "रेस्तरां और बाज़ारों के लिए",
    heroLead: "स्पष्ट वस्तुएँ, लिखित कीमत, आपकी रसोई तक ठंडी डिलीवरी।",
    heroBody: (founded, products, categories) =>
      `तसामी अलवतनिया एक सऊदी प्रतिष्ठान है (स्थापना ${founded}), यानबु में पंजीकृत। हम रेस्तरां, कैफ़े, होटल, कैटरिंग और बाज़ारों को थोक खाद्य देते हैं। कैटलॉग में ${products} वस्तुएँ और ${categories} श्रेणियाँ; हम मिस्री सलाम चावल के विशेष एजेंट हैं।`,
    whatsappCta: "व्हाट्सऐप पर कीमत माँगें",
    browseCatalog: "कैटलॉग देखें",
    whatsappMsg: "नमस्ते, तसामी अलवतनिया से थोक आपूर्ति के बारे में पूछना है",
    statFounded: "स्थापना वर्ष",
    statCategories: "कैटलॉग श्रेणियाँ",
    statProducts: "थोक वस्तुएँ",
    statBrands: "ब्रांड",
  },
};

/** Fix accidental CJK punctuation in Urdu block */
ur.home.certifications[4]!.desc = ur.home.certifications[4]!.desc.replace("。", ".");
for (const card of ur.home.miniCards) {
  card.desc = card.desc.replace(/[。]/g, ".");
}
for (const step of ur.home.processSteps) {
  step.desc = step.desc.replace(/[。]/g, ".");
}

export const messagesByLocale: Record<Locale, Messages> = { ar, ur, hi };

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? ar;
}