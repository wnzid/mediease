import en from "./dictionaries/en";
import lt from "./dictionaries/lt";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale, Locale } from "./config";
import { cookies } from "next/headers";

export async function getLocaleFromCookies(): Promise<Locale> {
  try {
    // `cookies()` may be either sync or async depending on Next version.
    // Awaiting is safe in both cases.
    const cookieStore: any = await cookies();
    const cookieLocale = cookieStore?.get?.(LOCALE_COOKIE)?.value;
    if (isSupportedLocale(cookieLocale)) return cookieLocale as Locale;
  } catch (e) {
    // ignore
  }
  return DEFAULT_LOCALE;
}

export async function getDictionary(locale?: string) {
  const l = isSupportedLocale(locale) ? locale : await getLocaleFromCookies();
  return l === "lt" ? lt : en;
}

export function t(dict: Record<string, any>, key: string, fallback?: string) {
  const parts = key.split(".");
  let cur: any = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else {
      return fallback ?? key;
    }
  }
  return typeof cur === "string" ? cur : fallback ?? key;
}
