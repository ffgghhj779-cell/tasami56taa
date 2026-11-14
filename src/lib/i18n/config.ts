export const LOCALES = ["ar", "en", "ur", "hi"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ar";

export const LOCALE_LABELS: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  ur: "اردو",
  hi: "हिन्दी",
};

export const LOCALE_MARKETS: Record<Locale, string> = {
  ar: "السعودية / الخليج",
  en: "Global",
  ur: "پاکستان",
  hi: "भारत",
};

export const LOCALE_HTML: Record<Locale, { lang: string; dir: "rtl" | "ltr" }> = {
  ar: { lang: "ar", dir: "rtl" },
  en: { lang: "en", dir: "ltr" },
  ur: { lang: "ur", dir: "rtl" },
  hi: { lang: "hi", dir: "ltr" },
};

export const LOCALE_OG: Record<Locale, string> = {
  ar: "ar_SA",
  en: "en_US",
  ur: "ur_PK",
  hi: "hi_IN",
};

/** Google Fonts — Hindi body uses Devanagari; ar/ur keep Cairo/Tajawal via CSS. */
export const HINDI_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localeDir(locale: Locale): "rtl" | "ltr" {
  return LOCALE_HTML[locale].dir;
}
