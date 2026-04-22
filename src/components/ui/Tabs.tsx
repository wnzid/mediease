"use client";

import { cn } from "@/lib/utils/cn";

type Tab = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-[var(--radius-control)] bg-[var(--color-panel-muted)] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            "min-h-9 rounded-[calc(var(--radius-control)-4px)] px-3.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]",
            value === tab.value
              ? "bg-white text-[var(--color-ink-950)] shadow-sm"
              : "text-[var(--color-ink-700)] hover:text-[var(--color-ink-900)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
