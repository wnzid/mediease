import { Icon } from "@/components/ui/Icon";

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function SearchBar({ label = "Search", className, ...props }: SearchBarProps) {
  const base =
    "h-[var(--size-control)] w-full rounded-[var(--radius-control)] border border-[var(--color-panel-border)] bg-white pl-11 pr-4 text-sm text-[var(--color-ink-950)] outline-none transition placeholder:text-[var(--color-ink-500)] focus:border-[var(--color-brand-500)] focus:ring-4 focus:ring-[var(--color-focus)]";

  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--color-ink-500)]" aria-hidden />
      <input className={`${base} ${className ?? ""}`} {...props} />
    </label>
  );
}
