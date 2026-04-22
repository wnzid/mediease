import { cn } from "@/lib/utils/cn";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex items-start gap-3 rounded-2xl border border-transparent p-1", className)}>
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-[var(--color-panel-border)] text-[var(--color-brand-600)] focus:ring-[var(--color-focus)]"
        {...props}
      />
      <span className="grid gap-1">
        <span className="text-sm font-medium text-[var(--color-ink-900)]">{label}</span>
        {description ? <span className="text-xs text-[var(--color-ink-600)]">{description}</span> : null}
      </span>
    </label>
  );
}
