"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "./dictionaries/en";
import lt from "./dictionaries/lt";
import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE, Locale } from "./config";

const DICTIONARIES: Record<string, Record<string, any>> = {
  en,
  lt,
};

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof initialLocale === "string" && isSupportedLocale(initialLocale)) return initialLocale;
    return DEFAULT_LOCALE;
  });

  // on mount, prefer cookie/localStorage if present
  useEffect(() => {
    try {
      const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
      const cookieVal = cookieMatch ? cookieMatch[1] : null;
      const ls = typeof window !== "undefined" ? window.localStorage.getItem(LOCALE_COOKIE) : null;
      const candidate = cookieVal ?? ls ?? null;
      if (candidate && isSupportedLocale(candidate) && candidate !== locale) setLocaleState(candidate);
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((l: Locale) => {
    if (!isSupportedLocale(l)) return;
    setLocaleState(l);
    try {
      const inOneYear = new Date();
      inOneYear.setFullYear(inOneYear.getFullYear() + 1);
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; expires=${inOneYear.toUTCString()}; SameSite=Lax`;
      window.localStorage.setItem(LOCALE_COOKIE, l);
      document.documentElement.lang = l;
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string, fallback?: string) => {
      const parts = key.split(".");
      let cur: any = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in cur) cur = cur[p];
        else {
          // fallback to default locale
          let dcur: any = DICTIONARIES[DEFAULT_LOCALE];
          for (const pp of parts) {
            if (dcur && typeof dcur === "object" && pp in dcur) dcur = dcur[pp];
            else {
              dcur = undefined;
              break;
            }
          }
          if (typeof dcur === "string") return dcur;
          return fallback ?? key;
        }
      }
      return typeof cur === "string" ? cur : fallback ?? key;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LocaleProvider");
  return ctx;
}
