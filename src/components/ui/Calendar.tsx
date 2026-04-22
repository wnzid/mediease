"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/useLocale";

type DaySummary = {
  status: "available" | "fullyBooked" | "unavailable";
  totalSlots: number;
  availableSlots: number;
};

type Props = {
  selectedDate?: string | null;
  onSelect: (dateIso: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string;
  availabilitySummary?: Record<string, DaySummary> | null;
  initialMonth?: string; // YYYY-MM
};

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function Calendar({ selectedDate, onSelect, minDate, maxDate, availabilitySummary, initialMonth }: Props) {
  const initial = useMemo(() => {
    if (initialMonth) {
      const [y, m] = initialMonth.split("-").map(Number);
      if (!Number.isNaN(y) && !Number.isNaN(m)) return new Date(y, m - 1, 1);
    }
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  }, [initialMonth]);

  const [monthStart, setMonthStart] = useState<Date>(initial);

  const days = useMemo(() => {
    const first = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
    const startDay = first.getDay();
    const gridStart = new Date(first);
    gridStart.setDate(1 - startDay);

    const out: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      out.push(d);
    }
    return out;
  }, [monthStart]);

  function prevMonth() {
    setMonthStart((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setMonthStart((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const { locale, t } = useLocale();

  const monthLabel = useMemo(() => monthStart.toLocaleString(locale ?? undefined, { month: "long", year: "numeric" }), [monthStart, locale]);

  const weekdayLabels = useMemo(() => {
    try {
      const fmt = new Intl.DateTimeFormat(locale ?? undefined, { weekday: "short" });
      const base = new Date(Date.UTC(2023, 0, 1)); // Sunday
      return Array.from({ length: 7 }).map((_, i) => fmt.format(new Date(Date.UTC(2023, 0, 1 + i))));
    } catch (e) {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
  }, [locale]);

  function isDisabled(dateIso: string) {
    // Disable past dates and dates outside explicit min/max bounds.
    if (minDate && dateIso < minDate) return true;
    if (maxDate && dateIso > maxDate) return true;
    if (dateIso < todayIso) return true;
    return false;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-[var(--color-ink-900)]">{monthLabel}</div>
        <div className="flex items-center gap-2">
          <button type="button" aria-label={t("calendar.previousMonth", "Previous month")} onClick={prevMonth} className="p-2 rounded hover:bg-[var(--color-panel-muted)]">
            <Icon name="chevron_left" className="h-4 w-4" />
          </button>
          <button type="button" aria-label={t("calendar.nextMonth", "Next month")} onClick={nextMonth} className="p-2 rounded hover:bg-[var(--color-panel-muted)]">
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-[var(--color-ink-600)] mb-2">
        {weekdayLabels.map((d) => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = isoDate(d);
          const inMonth = d.getMonth() === monthStart.getMonth();
          const selected = selectedDate === iso;
          const summary = availabilitySummary?.[iso] ?? null;
          const disabled = isDisabled(iso) || !inMonth;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => !disabled && onSelect(iso)}
              disabled={disabled}
              className={cn(
                "h-10 p-1 rounded flex flex-col items-center justify-center text-sm",
                inMonth ? "" : "opacity-30",
                selected ? "bg-[var(--color-brand-500)] text-white" : "bg-white",
                disabled ? "cursor-not-allowed" : "hover:bg-[var(--color-panel-muted)]"
              )}
            >
              <div className={cn("text-sm font-medium", selected ? "text-white" : "text-[var(--color-ink-900)]")}>{d.getDate()}</div>
              <div className="mt-1 h-2">
                {summary ? (
                  summary.status === "available" ? (
                    <span className="block h-2 w-2 rounded-full bg-[var(--color-brand-600)]" />
                  ) : summary.status === "fullyBooked" ? (
                    <span className="block h-2 w-2 rounded-full bg-[var(--color-amber-500)]" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-[var(--color-ink-300)]" />
                  )
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
