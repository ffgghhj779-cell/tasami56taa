import fs from 'fs'

const products = JSON.parse(fs.readFileSync('scripts/_ar-titles.json', 'utf8')).filter(
  (p) => !p.id.includes('_') || p.id.startsWith('p-') || p.id.startsWith('f-') || p.id.startsWith('v-') || p.id.startsWith('o-') || p.id.startsWith('j-') || p.id.startsWith('r-') || p.id.startsWith('e-') || p.id.startsWith('m-') || p.id.startsWith('d-') || p.id.startsWith('b-') || p.id.startsWith('w-') || p.id.startsWith('rf-') || /^[a-z]+-/.test(p.id),
)

/** High-quality English titles keyed by product id */
const EN = {
  'p-breast-rahan': 'Al Rehan Al Masi chicken breast',
  'p-chilled-rahan': 'Al Rehan Al Masi whole chilled chicken',
  'p-frozen-rahan-5': 'Al Rehan Al Masi whole frozen chicken',
  'p-badia': 'Badia whole chilled chicken',
  'p-golden-furooj': 'Golden Furooj chicken',
  'p-nasiriya': 'Al Nasiriya International chilled chicken',
  'p-alwadi': 'Al Wadi fresh chilled chicken',
  'p-zad-safy': 'Al Zad Al Safi chilled chicken',
  'p-shorouq': 'Al Tharawat chilled chicken',
  'p-nesmat': 'Nesmat premium chilled chicken',
  'p-shatr': 'Shater fresh chilled chicken',
  'f-oranges': 'Fresh imported oranges',
  'f-pomegranate': 'Fresh pomegranates',
  'f-lemon': 'Fresh Adalia lemons',
  'f-tomato': 'Fresh tomatoes',
  'f-onion': 'Fresh onions',
  'f-potato': 'Fresh potatoes',
  'f-garlic': 'Fresh garlic',
  'f-dates-showcase': 'Premium dates',
  'f-broccoli': 'Fresh broccoli',
  'f-cauliflower': 'Fresh cauliflower',
  'f-cabbage': 'Fresh cabbage',
  'f-sweet-potato': 'Fresh sweet potatoes',
  'f-lettuce': 'Fresh iceberg lettuce',
}

function guessEn(id, ar) {
  if (EN[id]) return EN[id]
  // Keep brand-heavy Arabic titles readable: strip to Latin brands when present is hard;
  // fall back to a cleaned transliteration-friendly label using Arabic → English glossary.
  const map = [
    [/صدور دجاج/g, 'Chicken breast'],
    [/دجاج كامل مبرد/g, 'Whole chilled chicken'],
    [/دجاج كامل مجمد/g, 'Whole frozen chicken'],
    [/دجاج/g, 'Chicken'],
    [/مبرّ?د|مبرد/g, 'chilled'],
    [/مجمّ?د|مجمد/g, 'frozen'],
    [/طازج/g, 'fresh'],
    [/بطاطس نصف مقلية|أصابع بطاطس/g, 'Par-fried fries'],
    [/بطاطس/g, 'Potato'],
    [/بيض/g, 'Eggs'],
    [/أرز سلام/g, 'Sallam rice'],
    [/أرز بسمتي|بسمتي/g, 'Basmati rice'],
    [/أرز/g, 'Rice'],
    [/زيت/g, 'Oil'],
    [/تونة/g, 'Tuna'],
    [/كاتشب/g, 'Ketchup'],
    [/صلصة/g, 'Sauce'],
    [/عصير/g, 'Juice'],
    [/لب مانجو|مانجو/g, 'Mango'],
    [/فراولة/g, 'Strawberry'],
    [/رمان/g, 'Pomegranate'],
    [/برتقال/g, 'Orange'],
    [/ليمون/g, 'Lemon'],
    [/طماطم/g, 'Tomato'],
    [/بصل/g, 'Onion'],
    [/ثوم/g, 'Garlic'],
    [/تمر|تمور/g, 'Dates'],
    [/بروكلي/g, 'Broccoli'],
    [/قرنبيط/g, 'Cauliflower'],
    [/كرنب/g, 'Cabbage'],
    [/بطاطا حلوة/g, 'Sweet potato'],
    [/خس|آيسبرغ|ايسبرغ/g, 'Lettuce'],
    [/فاصوليا/g, 'Green beans'],
    [/بسلة/g, 'Peas'],
    [/بامية/g, 'Okra'],
    [/ذرة/g, 'Corn'],
    [/ملوخية/g, 'Molokhia'],
    [/فول/g, 'Fava beans'],
    [/سبانخ/g, 'Spinach'],
    [/جوافة/g, 'Guava'],
    [/خروف/g, 'Lamb'],
    [/لحم|لحوم/g, 'Meat'],
    [/سمن/g, 'Ghee'],
    [/جبن/g, 'Cheese'],
    [/مياه|ماء/g, 'Water'],
    [/برجر/g, 'Burger'],
    [/بانيه/g, 'Panee'],
    [/كروكيت/g, 'Croquette'],
    [/كباب/g, 'Kebab'],
    [/فيليه/g, 'Fillet'],
    [/إسكالوب/g, 'Escalope'],
    [/مقرمش/g, 'crispy'],
    [/فاخر|ممتاز/g, 'premium'],
    [/الرهان الماسي/g, 'Al Rehan Al Masi'],
    [/بادية/g, 'Badia'],
    [/الفروج الذهبي/g, 'Golden Furooj'],
    [/الناصرية/g, 'Al Nasiriya'],
    [/الوادي/g, 'Al Wadi'],
    [/الزاد/g, 'Al Zad'],
    [/سلام/g, 'Sallam'],
    [/كجم/g, 'kg'],
    [/لتر/g, 'L'],
    [/مل/g, 'ml'],
  ]
  let s = ar
  for (const [re, en] of map) s = s.replace(re, en)
  s = s.replace(/[\u0600-\u06FF]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!s || /[\u0600-\u06FF]/.test(s) || s.length < 2) {
    // Last resort: humanize id
    return id
      .replace(/^(p|f|v|o|j|r|e|m|d|b|w|rf)-/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return s.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b(Kg|Ml|L)\b/g, (m) => m.toLowerCase() === 'l' ? 'L' : m)
}

const enMap = Object.fromEntries(products.map((p) => [p.id, guessEn(p.id, p.ar)]))

let file = fs.readFileSync('src/lib/i18n/catalogLocales.ts', 'utf8')
if (!file.includes('en?: string')) {
  file = file.replace(
    'export type CatalogLocaleEntry = { ur: string; hi: string };',
    'export type CatalogLocaleEntry = { ur: string; hi: string; en?: string };',
  )
}

file = file.replace(
  /"([^"]+)": \{ ur: "((?:\\.|[^"\\])*)", hi: "((?:\\.|[^"\\])*)"(?:, en: "((?:\\.|[^"\\])*)")? \}/g,
  (full, id, ur, hi) => {
    const en = (enMap[id] || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    if (!en) return `"${id}": { ur: "${ur}", hi: "${hi}" }`
    return `"${id}": { ur: "${ur}", hi: "${hi}", en: "${en}" }`
  },
)

file = file.replace(
  /export function localizedProductTitle[\s\S]*?\n\}/,
  `export function localizedProductTitle(locale: Locale, productId: string, fallbackAr: string): string {
  if (locale === "ar") return fallbackAr;
  const row = catalogLocales[productId];
  if (!row) return fallbackAr;
  if (locale === "en") return row.en || fallbackAr;
  if (locale === "ur") return row.ur;
  return row.hi;
}`,
)

fs.writeFileSync('src/lib/i18n/catalogLocales.ts', file)
console.log('en titles', Object.keys(enMap).length)
console.log(Object.entries(enMap).slice(0, 12))
