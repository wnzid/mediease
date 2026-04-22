"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n/useLocale";

export default function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();
  const { t } = useLocale();

  function goBack() {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    } catch (e) {
      router.push(fallbackHref);
    }
  }

  // Match Button ghost / sm styling without flipping the whole element.
  return (
    <div className="-ml-1">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-[0.95rem] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] bg-transparent text-[var(--color-ink-800)] hover:bg-[var(--color-panel-muted)] h-[var(--size-control-sm)] px-3.5 text-sm"
      >
        <Icon name="chevron-right" className="h-4 w-4 transform -rotate-180" aria-hidden />
        <span>{t("common.back", "Back")}</span>
      </button>
    </div>
  );
}
