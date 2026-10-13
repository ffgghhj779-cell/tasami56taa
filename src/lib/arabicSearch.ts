const replacements: Array<[RegExp, string]> = [
  [/[\u064B-\u0652]/g, ""],
  [/[أإآ]/g, "ا"],
  [/ة/g, "ه"],
  [/ى/g, "ي"],
  [/ؤ/g, "و"],
  [/ئ/g, "ي"],
];

const synonyms = ["دجاج فراخ فروج دواجن", "مبرد فريش طازج", "بطاطس بطاطا", "ارز رز"];

export function normalizeArabic(value: string) {
  let text = value.toLowerCase();
  for (const [pattern, next] of replacements) text = text.replace(pattern, next);
  return text.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function expand(value: string) {
  const base = normalizeArabic(value);
  const extra = synonyms
    .filter((group) => group.split(" ").some((word) => base.includes(word)))
    .join(" ");
  return `${base} ${extra}`.trim();
}

export function matchesArabic(haystack: string, query: string) {
  const q = normalizeArabic(query);
  if (!q) return true;
  const text = expand(haystack);
  return q.split(" ").filter((part) => part.length > 1).every((part) => expand(part).split(" ").some((token) => text.includes(token)));
}
