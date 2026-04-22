import { cn } from "@/lib/utils/cn";
import type { SelectOption } from "@/types/common";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
};

export function Select({ label, options, hint, error, id, className, ...props }: SelectProps) {
  const selectId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-ink-800)]" htmlFor={selectId}>
      <span>{label}</span>
      <select
        id={selectId}
        className={cn(
          "h-[var(--size-control)] rounded-[var(--radius-control)] border border-[var(--color-panel-border)] bg-white px-4 text-sm text-[var(--color-ink-950)] outline-none transition focus:border-[var(--color-brand-500)] focus:ring-4 focus:ring-[var(--color-focus)]",
          error && "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)]",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {options.map((option, i) => (
          <option key={`${option.value}-${i}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error ? <span className="text-xs font-normal text-[var(--color-ink-600)]">{hint}</span> : null}
      {error ? <span className="text-xs font-semibold text-[var(--color-danger-700)]">{error}</span> : null}
    </label>
  );
}
