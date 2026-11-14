import type { CatalogCategoryId } from "@/src/data/catalog";
import type { Locale } from "./config";

type CatFields = { title: string; heading: string; subtitle: string };

const ar: Record<CatalogCategoryId, CatFields> = {
  poultry: {
    title: "الدواجن المبردة والمجمدة",
    heading: "توريد دجاج بالجملة",
    subtitle: "دجاج كامل وصدور ومنتجات مجمدة",
  },
  fresh_produce: {
    title: "الخضار والفواكه الطازجة",
    heading: "توريد خضار وفواكه بالجملة",
    subtitle: "خضار وفواكه طازجة للمطاعم والأسواق",
  },
  frozen_veg_fruit: {
    title: "خضار وفاكهة مجمدة",
    heading: "خضار مجمدة بالجملة",
    subtitle: "مجمدات للاستخدام في المطابخ",
  },
  frozen_fries: {
    title: "البطاطس المجمدة",
    heading: "بطاطس مجمدة بالجملة",
    subtitle: "أصابع بطاطس بأحجام جملة للمطاعم",
  },
  oils_sauces_tuna: {
    title: "الزيوت والصلصات والتونة",
    heading: "توريد زيوت وصلصات بالجملة",
    subtitle: "زيوت طهي، معاجين، كاتشب، وتونة معلبة",
  },
  fresh_juices: {
    title: "العصائر الطازجة ولب الفاكهة",
    heading: "توريد عصائر ولب فاكهة بالجملة",
    subtitle: "عصائر جاهزة ولب مانجو",
  },
  rice_pulses: {
    title: "الأرز والبقوليات والمكرونة",
    heading: "توريد أرز بالجملة",
    subtitle: "يشمل أرز سلام الوكالة الحصرية، مع بسمتي وبقوليات ومكرونة",
  },
  eggs: {
    title: "البيض الطازج",
    heading: "توريد بيض طازج بالجملة",
    subtitle: "بيض مائدة بكميات توريد",
  },
  frozen_meat: {
    title: "اللحوم المبردة والمجمدة",
    heading: "توريد لحوم مبردة ومجمدة بالجملة",
    subtitle: "لحوم حمراء وخروف مبرد حسب المتوفر في الكتالوج",
  },
  dates: {
    title: "التمور الفاخرة",
    heading: "توريد تمور بالجملة",
    subtitle: "تمور للضيافة والجملة",
  },
  dairy: {
    title: "الألبان والأجبان والسمن",
    heading: "توريد ألبان وأجبان بالجملة",
    subtitle: "سمن وأجبان حسب المتوفر في الكتالوج",
  },
  beverages: {
    title: "المشروبات",
    heading: "توريد مشروبات بالجملة",
    subtitle: "مشروبات جاهزة حسب المتوفر في الكتالوج",
  },
  water: {
    title: "مياه الشرب",
    heading: "توريد مياه شرب بالجملة",
    subtitle: "مياه معبأة للفنادق والمطاعم",
  },
  ready_frozen: {
    title: "منتجات جاهزة مجمدة",
    heading: "منتجات جاهزة مجمدة بالجملة",
    subtitle: "بانيه، برجر، وأصابع جبن للمطاعم",
  },
};

const ur: Record<CatalogCategoryId, CatFields> = {
  poultry: {
    title: "ٹھنڈی اور منجمد چکن",
    heading: "تھوک چکن کی فراہمی",
    subtitle: "مکمل چکن، سینہ اور منجمد مصنوعات",
  },
  fresh_produce: {
    title: "تازہ سبزیاں اور پھل",
    heading: "تازہ سبزی و پھل تھوک میں",
    subtitle: "ریستوران اور منڈیوں کے لیے تازہ مصنوعات",
  },
  frozen_veg_fruit: {
    title: "منجمد سبزیاں اور پھل",
    heading: "منجمد سبزیاں تھوک میں",
    subtitle: "باورچی خانوں کے لیے منجمد اشیاء",
  },
  frozen_fries: {
    title: "منجمد آلو",
    heading: "منجمد فرنچ فرائز تھوک میں",
    subtitle: "ریستورانوں کے لیے تھوک سائز کی فرائز",
  },
  oils_sauces_tuna: {
    title: "تیل، ساس اور ٹونا",
    heading: "تیل اور ساس تھوک میں",
    subtitle: "پکانے کا تیل، پیسٹ، کیچپ اور ٹنڈ فش",
  },
  fresh_juices: {
    title: "تازہ جوس اور پلب",
    heading: "جوس تھوک میں",
    subtitle: "تیار جوس اور آم کا گودا",
  },
  rice_pulses: {
    title: "چاول، دالیں اور پاستا",
    heading: "چاول تھوک میں",
    subtitle: "سلام چاول (خصوصی ایجنسی)، باسماتی، دالیں اور پاستا",
  },
  eggs: {
    title: "تازہ انڈے",
    heading: "تازہ انڈے تھوک میں",
    subtitle: "ڈائننگ گریڈ انڈے بڑی مقدار میں",
  },
  frozen_meat: {
    title: "ٹھنڈا اور منجمد گوشت",
    heading: "گوشت تھوک میں",
    subtitle: "سرخ گوشت اور بکری، کیٹلاگ کے مطابق",
  },
  dates: {
    title: "نفیس کھجور",
    heading: "کھجور تھوک میں",
    subtitle: "مہمان نوازی اور تھوک کے لیے کھجور",
  },
  dairy: {
    title: "دودھ، پنیر اور گھی",
    heading: "ڈیری مصنوعات تھوک میں",
    subtitle: "گھی اور پنیر، دستیابی کے مطابق",
  },
  beverages: {
    title: "مشروبات",
    heading: "مشروبات تھوک میں",
    subtitle: "تیار مشروبات، دستیابی کے مطابق",
  },
  water: {
    title: "پینے کا پانی",
    heading: "بوتل والا پانی تھوک میں",
    subtitle: "ہوٹلوں اور ریستورانوں کے لیے",
  },
  ready_frozen: {
    title: "تیار منجمد مصنوعات",
    heading: "تیار منجمد تھوک میں",
    subtitle: "پنی، برگر اور چیز اسٹکس",
  },
};

const hi: Record<CatalogCategoryId, CatFields> = {
  poultry: {
    title: "ठंडा और जमे चिकन",
    heading: "थोक चिकन आपूर्ति",
    subtitle: "पूरा चिकन, छाती और जमे उत्पाद",
  },
  fresh_produce: {
    title: "ताज़ी सब्ज़ियाँ और फल",
    heading: "ताज़ी सब्ज़ी-फल थोक में",
    subtitle: "रेस्तरां और बाज़ारों के लिए ताज़ा माल",
  },
  frozen_veg_fruit: {
    title: "जमी सब्ज़ियाँ और फल",
    heading: "जमी सब्ज़ियाँ थोक में",
    subtitle: "व्यावसायिक रसोई के लिए फ्रोजन",
  },
  frozen_fries: {
    title: "जमे आलू (फ्राइज)",
    heading: "फ्रोजन फ्राइज थोक में",
    subtitle: "रेस्तरां के लिए थोक साइज फ्रेंच फ्राइज",
  },
  oils_sauces_tuna: {
    title: "तेल, सॉस और टूना",
    heading: "तेल और सॉस थोक में",
    subtitle: "खाना पकाने का तेल, पेस्ट, केचप और टूना",
  },
  fresh_juices: {
    title: "ताज़ा जूस और पल्प",
    heading: "जूस थोक में",
    subtitle: "तैयार जूस और आम का पल्प",
  },
  rice_pulses: {
    title: "चावल, दाल और पास्ता",
    heading: "चावल थोक में",
    subtitle: "सलाम चावल (विशेष एजेंसी), बासमती, दालें और पास्ता",
  },
  eggs: {
    title: "ताज़े अंडे",
    heading: "ताज़े अंडे थोक में",
    subtitle: "टेबल ग्रेड अंडे बड़ी मात्रा में",
  },
  frozen_meat: {
    title: "ठंडा और जमे मांस",
    heading: "मांस थोक में",
    subtitle: "लाल मांस और भेड़, कैटलॉग के अनुसार",
  },
  dates: {
    title: "बेहतरीन खजूर",
    heading: "खजूर थोक में",
    subtitle: "मेहमाननवाज़ी और थोक के लिए खजूर",
  },
  dairy: {
    title: "दूध, पनीर और घी",
    heading: "डेयरी थोक में",
    subtitle: "घी और पनीर, उपलब्धता के अनुसार",
  },
  beverages: {
    title: "पेय",
    heading: "पेय थोक में",
    subtitle: "तैयार पेय, उपलब्धता के अनुसार",
  },
  water: {
    title: "पीने का पानी",
    heading: "बोतलबंद पानी थोक में",
    subtitle: "होटलों और रेस्तरां के लिए",
  },
  ready_frozen: {
    title: "तैयार जमे उत्पाद",
    heading: "तैयार फ्रोजन थोक में",
    subtitle: "पनीर स्टिक्स, बर्गर और पनीर फिंगर्स",
  },
};

const byLocale = { ar, ur, hi } as const;

export function localizedCategory(
  locale: Locale,
  id: CatalogCategoryId,
  field: keyof CatFields,
  fallback: string,
): string {
  if (locale === "ar") return fallback;
  return byLocale[locale][id]?.[field] ?? fallback;
}