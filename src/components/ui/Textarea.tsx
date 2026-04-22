import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, id, className, ...props },
  ref,
) {
  const textareaId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-ink-800)]" htmlFor={textareaId}>
      <span>{label}</span>
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          "min-h-32 rounded-[var(--radius-control)] border border-[var(--color-panel-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-500)] focus:border-[var(--color-brand-500)] focus:ring-4 focus:ring-[var(--color-focus)]",
          error && "border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)]",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {hint && !error ? <span className="text-xs font-normal text-[var(--color-ink-600)]">{hint}</span> : null}
      {error ? <span className="text-xs font-semibold text-[var(--color-danger-700)]">{error}</span> : null}
    </label>
  );
});
