import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function MetricCard({
  label,
  value,
  delta,
  helper,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  delta?: string;
  helper?: string;
  tone?: "neutral" | "positive" | "warning";
}) {
  const accentStrip = {
    neutral: "from-[var(--color-brand-400)]/75 to-[var(--color-brand-200)]/15",
    positive: "from-[var(--color-success-700)]/75 to-[var(--color-success-200)]/15",
    warning: "from-[var(--color-warning-700)]/8 to-[var(--color-warning-200)]/45",
  }[tone];

  const deltaClass = {
    neutral: "border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]",
    positive: "border border-[var(--color-success-200)] bg-[var(--color-success-100)] text-[var(--color-success-700)]",
    warning: "border border-[var(--color-warning-200)] bg-[var(--color-warning-100)] text-[var(--color-warning-800)]",
  }[tone];

  return (
    <Card className="relative overflow-hidden">
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accentStrip)} aria-hidden />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink-600)]">{label}</p>
          <p className="mt-2 text-[1.95rem] font-semibold leading-none text-[var(--color-ink-950)]">{value}</p>
          {helper ? <p className="mt-1.5 text-sm leading-6 text-[var(--color-ink-600)]">{helper}</p> : null}
          {delta ? (
            <p className={cn("mt-3 inline-flex rounded-[0.75rem] px-2.5 py-1 text-xs font-semibold", deltaClass)}>
              {delta}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
