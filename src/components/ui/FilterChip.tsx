"use client";

import { cn } from "@/lib/utils/cn";

type FilterChipProps = {
  active: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full border px-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]",
        active
          ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
          : "border-[var(--color-panel-border)] bg-white text-[var(--color-ink-700)] hover:border-[var(--color-brand-300)]",
      )}
    >
      {children}
    </button>
  );
}
