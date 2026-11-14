import type { Locale } from "./config";
import { DEFAULT_LOCALE, isLocale, localeDir } from "./config";
import { getMessages, type Messages } from "./ui";

export type { Messages };

/** Translate accessor — `tx(locale)` returns the full UI bundle for that locale. */
export function tx(locale: Locale): Messages {
  return getMessages(locale);
}

const LOCALE_PREFIX = /^\/(en|ur|hi|ar)(?=\/|$)/;

export function parseLocalePath(pathname: string): { locale: Locale; pathname: string } {
  const match = pathname.match(LOCALE_PREFIX);
  if (!match || !isLocale(match[1])) {
    return { locale: DEFAULT_LOCALE, pathname: pathname || "/" };
  }
  const locale = match[1];
  const rest = pathname.slice(match[0].length);
  const bare = rest === "" ? "/" : rest.startsWith("/") ? rest : `/${rest}`;
  return { locale, pathname: bare };
}

/** Path prefix for public routes (`''` for default Arabic). */
export function localePathPrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/** Build a localized path (`/about` → `/ur/about` when locale is ur). */
export function localizePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const hashIdx = normalized.indexOf("#");
  const hash = hashIdx >= 0 ? normalized.slice(hashIdx) : "";
  const pathOnly = hashIdx >= 0 ? normalized.slice(0, hashIdx) : normalized;

  if (pathOnly === "/") {
    const base = localePathPrefix(locale) || "/";
    return `${base}${hash}`;
  }

  const prefix = localePathPrefix(locale);
  return `${prefix}${pathOnly}${hash}`;
}

/** Swap locale while staying on the same logical page. */
export function switchLocalePath(currentPathname: string, target: Locale): string {
  const { pathname } = parseLocalePath(currentPathname);
  return localizePath(target, pathname);
}

export function localeClassName(locale: Locale): string {
  return localeDir(locale) === "ltr" ? "locale-ltr" : "locale-rtl";
}