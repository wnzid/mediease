"use client";

import { useI18n } from "./provider";

export function useLocale() {
  const { locale, setLocale, t } = useI18n();
  return { locale, setLocale, t } as const;
}
