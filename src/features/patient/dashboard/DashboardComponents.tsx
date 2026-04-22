import { Card, CardHeader } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import { formatDate, formatTime } from "@/lib/formatting/date";
import { getDictionary, t as serverT } from "@/lib/i18n/server";

type ReminderItem = {
  id?: string;
  title: string;
  detail?: string;
  href?: string;
  critical?: boolean;
};

type MedicalSummary = {
  allergies?: unknown[];
  conditions?: unknown[];
  medications?: unknown[];
} | null | undefined;

type AppointmentSummary = {
  id: string;
  startsAt: string;
  doctorName: string;
  specialty: string;
  location: string;
  appointmentType: string;
};

type ActivityItem = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

type ClinicSummary = {
  name: string;
  address?: string;
};

type SupportDoctor = {
  id: string;
  name: string;
  role?: string;
  phone?: string;
};

export function HeaderSummary({
  patientName,
  patientId,
  age,
  summary,
}: {
  patientName?: string;
  patientId?: string;
  age?: number | string;
  summary?: string;
}) {
  const dict = getDictionary();
  // If no identifying props or a summary are provided, don't render an empty header.
  if (patientName === undefined && patientId === undefined && age === undefined && summary === undefined) return null;

  const name = patientName ?? serverT(dict, "patient.dashboard.header.name", "Patient");
  const idLabel = patientId ? `${serverT(dict, "patient.dashboard.header.id", "ID")} ${patientId}` : null;

  // Only show a medical summary when one exists; do not render a fallback message.
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-lg font-semibold text-[var(--color-ink-900)]">{name}</p>
          {idLabel ? <p className="mt-1 text-sm text-[var(--color-ink-600)]">{idLabel}</p> : null}
        </div>
      </div>
      {summary ? <div className="text-sm text-[var(--color-ink-700)]">{summary}</div> : null}
    </div>
  );
}

export function ActionCenter({
  profileCompletion,
  medicalSummary,
  reminders,
}: {
  profileCompletion?: number;
  medicalSummary?: MedicalSummary;
  reminders?: ReminderItem[];
}) {
  const tasks: Array<Required<Pick<ReminderItem, "title">> & { id: string; detail?: string; href?: string; icon?: string }> = [];

  if (typeof profileCompletion === "number" && profileCompletion < 80) {
    const dict = getDictionary();
    tasks.push({
      id: "profile",
      title: serverT(dict, "patient.dashboard.tasks.completeProfile", "Complete your profile"),
      detail: serverT(dict, "patient.dashboard.tasks.profileDetail", "{pct}% complete").replace("{pct}", String(profileCompletion)),
      href: "/patient/profile/onboarding",
      icon: "user-round",
    });
  }

  const medEmpty =
    !medicalSummary ||
    !((medicalSummary.allergies?.length ?? 0) || (medicalSummary.conditions?.length ?? 0) || (medicalSummary.medications?.length ?? 0));

  if (medEmpty) {
    const dict = getDictionary();
    tasks.push({
      id: "medical",
      title: serverT(dict, "patient.dashboard.tasks.addMedicalSummary", "Add your medical summary"),
      detail: serverT(dict, "patient.dashboard.tasks.medicalDetail", "Allergies, conditions, and medications"),
      href: "/patient/profile",
      icon: "file-text",
    });
  }

  if (Array.isArray(reminders) && reminders.length) {
    reminders.forEach((reminder, index) =>
      tasks.push({
        id: reminder.id ?? `rem-${index}`,
        title: reminder.title,
        detail: reminder.detail,
        href: reminder.href ?? "#",
        icon: reminder.critical ? "warning" : "check-circle",
      }),
    );
  }

  const dict = getDictionary();

  return (
    <Card className="border-[var(--color-brand-100)] bg-[var(--color-brand-50)]">
      <CardHeader
        title={serverT(dict, "patient.dashboard.actionCenter.title", "Action center")}
        description={tasks.length ? serverT(dict, "patient.dashboard.actionCenter.descriptionTasks", "Important tasks that still need attention") : serverT(dict, "patient.dashboard.actionCenter.descriptionEmpty", "No urgent actions right now")}
        action={
          tasks.length ? (
            <span className="inline-flex rounded-[0.7rem] border border-[var(--color-brand-100)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-brand-700)]">
              {serverT(dict, "patient.dashboard.actionCenter.openBadge", "{count} open").replace("{count}", String(tasks.length))}
            </span>
          ) : null
        }
      />

      {tasks.length ? (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-[0.8rem]",
                    task.icon === "warning"
                      ? "bg-[var(--color-warning-100)] text-[var(--color-warning-800)]"
                      : "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]",
                  )}
                >
                  <Icon name={task.icon || "clipboard-list"} className="h-[18px] w-[18px]" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink-900)]">{task.title}</p>
                  {task.detail ? <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{task.detail}</p> : null}
                </div>
              </div>
              {task.href ? (
                <LinkButton href={task.href} variant="secondary" size="sm" iconRight="chevron-right" className="shrink-0">
                  {serverT(dict, "patient.dashboard.actionCenter.takeAction", "Take action")}
                </LinkButton>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[0.9rem] border border-[var(--color-panel-border)] bg-white px-4 py-3.5 text-sm leading-6 text-[var(--color-ink-700)]">
          {serverT(dict, "patient.dashboard.actionCenter.empty", "You have no outstanding tasks. Check messages or documents for recent updates.")}
        </div>
      )}
    </Card>
  );
}

export function HealthSnapshot({
  prescriptions,
  tests,
  messages,
}: {
  prescriptions?: number;
  tests?: number;
  messages?: number;
}) {
  const dict = getDictionary();
  const rows = [
    { id: "pres", label: serverT(dict, "patient.dashboard.healthSnapshot.prescriptions", "Active prescriptions"), value: prescriptions, icon: "clipboard-list", href: "/patient/documents" },
    { id: "tests", label: serverT(dict, "patient.dashboard.healthSnapshot.tests", "Test results"), value: tests, icon: "file-text", href: "/patient/documents" },
    { id: "msgs", label: serverT(dict, "patient.dashboard.healthSnapshot.messages", "Messages"), value: messages, icon: "message-square", href: "/patient/messages" },
  ];

  const hasAny = rows.some((row) => typeof row.value === "number" && row.value > 0);

  return (
    <Card>
      <CardHeader title={serverT(dict, "patient.dashboard.healthSnapshot.title", "Health snapshot")} description={serverT(dict, "patient.dashboard.healthSnapshot.description", "Key counts that are easy to scan at a glance")} />
      {hasAny ? (
        <div className="grid gap-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] px-3.5 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                  <Icon name={row.icon} className="h-[18px] w-[18px]" aria-hidden />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-ink-700)]">{row.label}</p>
                  <p className="text-xl font-semibold text-[var(--color-ink-950)]">{typeof row.value === "number" ? row.value : "--"}</p>
                </div>
              </div>
              <LinkButton href={row.href} variant="ghost" size="sm" className="text-[var(--color-brand-700)]">
                {serverT(dict, "patient.dashboard.healthSnapshot.view", "View")}
              </LinkButton>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">
          {serverT(dict, "patient.dashboard.healthSnapshot.empty", "No active prescriptions, recent test results, or unread messages.")}
        </p>
      )}
    </Card>
  );
}

export function NextAppointment({ appointment }: { appointment?: AppointmentSummary | null }) {
  const dict = getDictionary();

  return (
    <Card>
      <CardHeader
        title={serverT(dict, "patient.dashboard.nextAppointment.title", "Next appointment")}
        description={
          appointment ? `${formatDate(appointment.startsAt)} at ${formatTime(appointment.startsAt)}` : serverT(dict, "patient.dashboard.nextAppointment.noUpcoming", "No upcoming visits")
        }
        action={
          <div className="flex items-center gap-2">
            {!appointment ? (
              <LinkButton href="/patient/book" variant="secondary" size="sm">
                {serverT(dict, "patient.dashboard.nextAppointment.bookVisit", "Book visit")}
              </LinkButton>
            ) : null}
            <LinkButton href="/patient/appointments" variant={appointment ? "outline" : "ghost"} size="sm">
              {serverT(dict, "patient.dashboard.nextAppointment.viewAll", "View all")}
            </LinkButton>
          </div>
        }
      />

      {appointment ? (
        <div className="space-y-4">
          <div className="rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] p-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">{serverT(dict, "patient.dashboard.nextAppointment.upcomingVisitLabel", "Upcoming visit")}</p>
              <p className="text-base font-semibold text-[var(--color-ink-900)]">
                {appointment.doctorName}, {appointment.specialty}
              </p>
              <p className="text-sm leading-6 text-[var(--color-ink-600)]">
                {appointment.location} / {appointment.appointmentType}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={`/patient/appointments/${appointment.id}`} variant="outline" size="sm">
              {serverT(dict, "patient.dashboard.nextAppointment.viewDetails", "View details")}
            </LinkButton>
            <LinkButton href={`/patient/appointments/${appointment.id}/reschedule`} variant="ghost" size="sm">
              {serverT(dict, "patient.dashboard.nextAppointment.reschedule", "Reschedule")}
            </LinkButton>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">
          {serverT(dict, "patient.dashboard.nextAppointment.empty", "You have no appointments scheduled. Book a visit when you are ready from the top actions.")}
        </p>
      )}
    </Card>
  );
}

export function RecentActivity({ items = [] }: { items?: ActivityItem[] }) {
  const list = Array.isArray(items) ? items.slice(0, 5) : [];

  const dict = getDictionary();

  return (
    <Card>
      <CardHeader title={serverT(dict, "patient.dashboard.recentUpdates.title", "Recent updates")} description={list.length ? serverT(dict, "patient.dashboard.recentUpdates.descriptionList", "The latest changes to your account") : serverT(dict, "patient.dashboard.recentUpdates.noRecent", "No recent updates")} />

      {list.length ? (
        <div className="grid gap-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] px-3.5 py-3"
            >
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">
                <Icon name={item.icon || "file-text"} className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--color-ink-900)]">{item.title}</p>
                {item.description ? <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{item.description}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">{serverT(dict, "patient.dashboard.recentUpdates.empty", "No recent activity. Check your records or messages for updates.")}</p>
      )}
    </Card>
  );
}

export function CareTeamSupport({
  clinic,
  doctors = [],
}: {
  clinic?: ClinicSummary | null;
  doctors?: SupportDoctor[];
}) {
  const hasClinic = Boolean(clinic);
  const hasDoctors = Array.isArray(doctors) && doctors.length > 0;

  if (!hasClinic && !hasDoctors) return null;

  const dict = getDictionary();

  return (
    <Card>
      <CardHeader title={serverT(dict, "patient.dashboard.careTeam.title", "Care team")} description={serverT(dict, "patient.dashboard.careTeam.description", "Primary clinic and providers")} />
      <div className="grid gap-3">
        {hasClinic ? (
          <div className="rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] p-3.5">
            <p className="text-sm font-semibold text-[var(--color-ink-900)]">{clinic?.name}</p>
            {clinic?.address ? <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{clinic.address}</p> : null}
          </div>
        ) : null}

        {hasDoctors ? (
          <div className="grid gap-2.5">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3"
              >
                <Avatar name={doctor.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink-900)]">{doctor.name}</p>
                  <p className="text-sm text-[var(--color-ink-600)]">{doctor.role}</p>
                </div>
                <div className="ml-auto">
                  {doctor.phone ? (
                    <LinkButton href={`tel:${doctor.phone}`} variant="ghost" size="sm" iconLeft="phone" className="text-[var(--color-brand-700)]">
                      Call
                    </LinkButton>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
