import Link from "next/link";
import { Card } from "@/components/ui/Card";
import BackButton from "@/components/layout/BackButton";

export function AuthFormShell({
  eyebrow,
  title,
  description,
  alternateHref,
  alternateLabel,
  children,
  compact,
  showBack,
  backHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  alternateHref?: string;
  alternateLabel?: string;
  children: React.ReactNode;
  compact?: boolean;
  showBack?: boolean;
  backHref?: string;
}) {
  const cardPadding = compact ? "p-6 sm:p-7" : "p-6 sm:p-8";
  const titleSize = compact ? "text-2xl" : "text-[1.95rem]";
  const gapTop = compact ? "mt-5" : "mt-6";

  return (
    <Card className={`w-full max-w-[var(--layout-auth-panel-width)] bg-white ${cardPadding}`}>
      {showBack ? (
        <div className="mb-3">
          <BackButton fallbackHref={backHref ?? "/"} />
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">{eyebrow}</p>
        <h1 className={`${titleSize} font-semibold tracking-[-0.03em] text-[var(--color-ink-950)]`}>{title}</h1>
        <p className="text-sm leading-6 text-[var(--color-ink-600)] sm:text-[15px]">{description}</p>
      </div>
      <div className={gapTop}>{children}</div>
      {alternateHref && alternateLabel ? (
        <p className="mt-5 text-sm text-[var(--color-ink-600)]">
          <Link href={alternateHref} className="font-semibold text-[var(--color-brand-700)]">
            {alternateLabel}
          </Link>
        </p>
      ) : null}
    </Card>
  );
}
