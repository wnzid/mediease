import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="grid justify-items-start gap-4 text-left">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
        <Icon name={icon} className="h-5 w-5" aria-hidden />
      </div>
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-[var(--color-ink-950)]">{title}</h2>
        <p className="max-w-prose text-sm leading-6 text-[var(--color-ink-600)]">{description}</p>
      </div>
      {actionLabel && actionHref ? <LinkButton href={actionHref} size="sm">{actionLabel}</LinkButton> : null}
    </Card>
  );
}
