import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-ink-800)]" htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-[var(--size-control)] rounded-[var(--radius-control)] border border-[var(--color-panel-border)] bg-white px-4 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-500)] focus:border-[var(--color-brand-500)] focus:ring-4 focus:ring-[var(--color-focus)]",
          error && "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)]",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error ? (
        <span className="text-xs font-normal text-[var(--color-ink-600)]" id={`${inputId}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="text-xs font-semibold text-[var(--color-danger-700)]" id={`${inputId}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
});
