"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/useLocale";
import { Icon } from "@/components/ui/Icon";

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function select(l: typeof locale) {
    setLocale(l);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded px-2.5 py-1 text-sm font-medium text-[var(--color-ink-700)] hover:bg-[var(--color-panel-muted)]"
      >
        <span className="sr-only">{t("common.language")}</span>
        <span>{locale === "en" ? "EN" : "LT"}</span>
        <Icon name="chevron-down" className="h-3 w-3 text-[var(--color-ink-600)]" aria-hidden />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("common.language")}
          className="absolute right-0 mt-2 w-36 rounded border bg-white p-1 text-sm shadow-[var(--shadow-panel)]"
        >
          <li>
            <button
              onClick={() => select("en")}
              className={`w-full text-left px-3 py-2 ${locale === "en" ? "font-semibold" : ""}`}
            >
              {t("common.english")}
            </button>
          </li>
          <li>
            <button
              onClick={() => select("lt")}
              className={`w-full text-left px-3 py-2 ${locale === "lt" ? "font-semibold" : ""}`}
            >
              {t("common.lithuanian")}
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
