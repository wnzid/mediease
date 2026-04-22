import Link from "next/link";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate, formatTime } from "@/lib/formatting/date";
import type { Appointment } from "@/types/appointments";

export function AppointmentCard({
  appointment,
  href,
  doctor,
  clinic,
}: {
  appointment: Appointment;
  href?: string;
  doctor?: { fullName?: string } | null;
  clinic?: { name?: string } | null;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{appointment.mode}</p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink-950)]">
            {doctor?.fullName ?? "Assigned clinician"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-600)]">
            {formatDate(appointment.startsAt)} at {formatTime(appointment.startsAt)} / {clinic?.name}
          </p>
          {appointment.reference ? (
            <p className="mt-1 text-xs text-[var(--color-ink-600)]">Ref: {appointment.reference}</p>
          ) : null}
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">{appointment.appointmentType}</Badge>
        <Badge className="bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">{appointment.mode}</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-ink-700)]">{appointment.reason}</p>
      {href ? (
        <Link href={href} className="mt-5 inline-flex text-sm font-semibold text-[var(--color-brand-700)]">
          Review details
        </Link>
      ) : null}
    </Card>
  );
}
