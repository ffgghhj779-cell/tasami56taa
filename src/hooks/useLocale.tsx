import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_LOCALE,
  HINDI_FONT_HREF,
  LOCALE_HTML,
  type Locale,
} from "@/src/lib/i18n/config";
import {
  localizePath,
  parseLocalePath,
  switchLocalePath,
  tx,
  type Messages,
} from "@/src/lib/i18n/localize";

type LocaleContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  lang: string;
  t: Messages;
  localizePath: (path: string) => string;
  switchLocalePath: (target: Locale) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const HINDI_FONT_ID = "noto-sans-devanagari";

function ensureHindiFont(enabled: boolean) {
  let link = document.getElementById(HINDI_FONT_ID) as HTMLLinkElement | null;
  if (enabled) {
    if (!link) {
      link = document.createElement("link");
      link.id = HINDI_FONT_ID;
      link.rel = "stylesheet";
      link.href = HINDI_FONT_HREF;
      document.head.appendChild(link);
    }
  } else if (link) {
    link.remove();
  }
}

type Props = {
  locale?: Locale;
  children: ReactNode;
};

export function LocaleProvider({ locale: localeProp, children }: Props) {
  const location = useLocation();
  const parsed = parseLocalePath(location.pathname);
  const locale = localeProp ?? parsed.locale ?? DEFAULT_LOCALE;
  const { lang, dir } = LOCALE_HTML[locale];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle("locale-hi", locale === "hi");
    ensureHindiFont(locale === "hi");
  }, [lang, dir, locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir,
      lang,
      t: tx(locale),
      localizePath: (path: string) => localizePath(locale, path),
      switchLocalePath: (target: Locale) =>
        switchLocalePath(location.pathname + location.hash, target),
    }),
    [locale, dir, lang, location.pathname, location.hash],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      dir: "rtl",
      lang: "ar",
      t: tx(DEFAULT_LOCALE),
      localizePath: (path) => localizePath(DEFAULT_LOCALE, path),
      switchLocalePath: (target) => localizePath(target, "/"),
    };
  }
  return ctx;
}