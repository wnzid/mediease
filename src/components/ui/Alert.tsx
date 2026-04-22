import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

type AlertTone = "info" | "success" | "warning" | "danger";

const toneClasses: Record<AlertTone, string> = {
  info: "border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-900)]",
  success: "border-[var(--color-success-200)] bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  warning: "border-[var(--color-warning-200)] bg-[var(--color-warning-100)] text-[var(--color-warning-800)]",
  danger: "border-[var(--color-danger-200)] bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
};

const toneIcons: Record<AlertTone, string> = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

export function Alert({
  tone = "info",
  title,
  description,
  className,
}: {
  tone?: AlertTone;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 items-start rounded-[var(--radius-panel)] border p-4", toneClasses[tone], className)} role="status">
      <Icon name={toneIcons[tone]} className="mt-0.5 w-5 h-5" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        {description ? <p className="mt-1 text-sm opacity-85">{description}</p> : null}
      </div>
    </div>
  );
}
