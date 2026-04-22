import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white p-[var(--space-card)] shadow-none",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-[1.05rem] font-semibold text-[var(--color-ink-950)]">{title}</h2>
        {description ? <p className="mt-1 text-[13px] leading-6 text-[var(--color-ink-600)] md:text-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
