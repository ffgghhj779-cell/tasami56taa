import type { ReactNode } from "react";

/** Marketing / customer paths that get `/ur`, `/hi`, `/ar` mirrors. */
export const PUBLIC_PATH_SEGMENTS = [
  "",
  "about",
  "restaurants",
  "markets",
  "delivery",
  "products/:slug",
  "request",
  "cart",
  "checkout",
  "pay",
  "payment/callback",
  "order-success",
  "login",
  "register",
  "account",
] as const;

const LOCALE_SEGMENTS = ["ur", "hi", "ar"] as const;

/** Expand one segment ("" = home) into react-router `path` strings. */
export function pathsForSegment(segment: string): string[] {
  const base = segment;
  const prefixed = LOCALE_SEGMENTS.map((loc) => (base ? `${loc}/${base}` : loc));
  return [base, ...prefixed];
}

export function mapLocalizedRoutes(
  segment: string,
  element: ReactNode,
): { path: string; element: ReactNode }[] {
  return pathsForSegment(segment).map((path) => ({ path, element }));
}