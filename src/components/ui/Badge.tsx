"use client";

import { cn } from "@/lib/utils/cn";
import type { AppointmentStatus } from "@/types/appointments";
import { useLocale } from "@/lib/i18n/useLocale";

const statusClasses: Record<AppointmentStatus, string> = {
  pending: "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
  confirmed: "bg-[var(--color-brand-100)] text-[var(--color-brand-700)]",
  completed: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  canceled: "bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
  rescheduled: "bg-[var(--color-accent-100)] text-[var(--color-accent-700)]",
};

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-[var(--radius-badge)] px-2.5 py-1 text-[11px] font-semibold leading-none",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useLocale();
  const label = t(`patient.appointmentCard.statusNames.${status}`, status.replace("-", " "));
  return <Badge className={statusClasses[status]}>{label}</Badge>;
}
