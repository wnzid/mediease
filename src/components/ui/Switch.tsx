"use client";

import { cn } from "@/lib/utils/cn";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export function Switch({ checked, onCheckedChange, label, description }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white px-4 py-3">
      <span className="grid gap-1">
        <span className="text-sm font-semibold text-[var(--color-ink-900)]">{label}</span>
        {description ? <span className="text-xs leading-5 text-[var(--color-ink-600)]">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]",
          checked ? "bg-[var(--color-brand-600)]" : "bg-[var(--color-panel-border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition",
            checked ? "left-5.5" : "left-0.5",
          )}
        />
      </button>
    </label>
  );
}
