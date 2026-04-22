"use client";

import { cn } from "@/lib/utils/cn";

type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

type RadioGroupProps = {
  label: string;
  name: string;
  options: ReadonlyArray<RadioOption>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  columns?: 1 | 2;
};

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  columns = 1,
}: RadioGroupProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium text-[var(--color-ink-800)]">{label}</legend>
      <div className={cn("grid gap-3", columns === 2 && "md:grid-cols-2")}>
        {options.map((option) => {
          const checked = option.value === value;

          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-[var(--radius-panel)] border p-4 transition",
                checked
                  ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)]"
                  : "border-[var(--color-panel-border)] bg-white hover:border-[var(--color-brand-300)]",
              )}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span className="block text-sm font-semibold text-[var(--color-ink-900)]">{option.label}</span>
              {option.description ? (
                <span className="mt-1 block text-sm leading-6 text-[var(--color-ink-600)]">{option.description}</span>
              ) : null}
            </label>
          );
        })}
      </div>
      {error ? <span className="text-xs font-semibold text-[var(--color-danger-700)]">{error}</span> : null}
    </fieldset>
  );
}
