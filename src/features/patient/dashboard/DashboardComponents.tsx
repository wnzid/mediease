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

export async function HeaderSummary({
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
  const dict = await getDictionary();
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

export async function DashboardTop({
  patientName,
  profileCompletion,
  nextAppointment,
}: {
  patientName?: string | undefined;
  profileCompletion?: number | undefined;
  nextAppointment?: { startsAt?: string } | null | undefined;
}) {
  const dict = await getDictionary();

  const name = patientName ?? serverT(dict, "patient.dashboard.header.name", "Patient");

  return (
    <div className="-mt-16 mb-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
      <div>
        <p className="text-lg font-semibold text-[var(--color-ink-900)]">{serverT(dict, "patient.dashboard.top.greeting", "Hi")}, {name}</p>
        <p className="mt-1 text-sm text-[var(--color-ink-700)]">{serverT(dict, "patient.dashboard.top.description", "Here’s what needs your attention today")}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {nextAppointment && nextAppointment.startsAt ? (
            <div className="rounded-full border border-[var(--color-panel-border)] bg-white px-3 py-1 text-sm font-medium text-[var(--color-ink-900)]">
              {serverT(dict, "patient.dashboard.top.nextVisit", "Next visit")}: {formatDate(nextAppointment.startsAt)}
            </div>
          ) : null}

          {typeof profileCompletion === "number" ? (
            <div className="rounded-full border border-[var(--color-panel-border)] bg-white px-3 py-1 text-sm font-medium text-[var(--color-ink-900)]">
              {serverT(dict, "patient.dashboard.top.profileCompletion", "Profile")}: {String(profileCompletion)}%
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LinkButton href="/patient/book" size="md">
          {serverT(dict, "patient.dashboard.top.book", "Book visit")}
        </LinkButton>
        {typeof profileCompletion === "number" && profileCompletion < 80 ? (
          <LinkButton href="/patient/profile/onboarding" variant="ghost" size="md">
            {serverT(dict, "patient.dashboard.top.completeProfile", "Complete profile")}
          </LinkButton>
        ) : (
          <LinkButton href="/doctors" variant="ghost" size="md">
            {serverT(dict, "patient.dashboard.top.findDoctor", "Find doctor")}
          </LinkButton>
        )}
      </div>
    </div>
  );
}

export function QuickActions() {
  return (
    <div className="mb-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
      <LinkButton href="/patient/book" variant="ghost" size="sm" className="justify-start gap-2">
        <Icon name="calendar-days" className="h-4 w-4 text-[var(--color-brand-700)]" aria-hidden />
        <span className="text-sm font-medium">Book visit</span>
      </LinkButton>
      <LinkButton href="/doctors" variant="ghost" size="sm" className="justify-start gap-2">
        <Icon name="user-round" className="h-4 w-4 text-[var(--color-brand-700)]" aria-hidden />
        <span className="text-sm font-medium">Find doctor</span>
      </LinkButton>
    </div>
  );
}

export async function ActionCenter({
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
    const dict = await getDictionary();
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
    const dict = await getDictionary();
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

  const dict = await getDictionary();

  // Compact presentation: if no tasks, show a small success state
  if (!tasks.length) {
    return (
      <Card className="border-[var(--color-panel-border)] bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
            <Icon name="check-circle" className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-ink-900)]">{serverT(dict, "patient.dashboard.actionCenter.title", "Action center")}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-700)]">{serverT(dict, "patient.dashboard.actionCenter.empty", "You're all set — no outstanding tasks.")}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--color-brand-100)] bg-[var(--color-brand-50)]">
      <CardHeader
        title={serverT(dict, "patient.dashboard.actionCenter.title", "Action center")}
        description={serverT(dict, "patient.dashboard.actionCenter.descriptionTasks", "Important tasks that still need attention")}
        action={
          <span className="inline-flex rounded-[0.7rem] border border-[var(--color-brand-100)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-brand-700)]">
            {serverT(dict, "patient.dashboard.actionCenter.openBadge", "{count} open").replace("{count}", String(tasks.length))}
          </span>
        }
      />

      <div className="grid gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white p-3"
          >
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
            <div className="ml-auto">
              {task.href ? (
                <LinkButton href={task.href} variant="secondary" size="sm" iconRight="chevron-right" className="shrink-0">
                  {serverT(dict, "patient.dashboard.actionCenter.takeAction", "Take action")}
                </LinkButton>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export async function HealthSnapshot({
  prescriptions,
  tests,
  messages,
}: {
  prescriptions?: number;
  tests?: number;
  messages?: number;
}) {
  const dict = await getDictionary();
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

export async function NextAppointment({ appointment, error }: { appointment?: AppointmentSummary | null; error?: boolean }) {
  const dict = await getDictionary();

  // Card header description
  const headerDescription = error
    ? serverT(dict, "patient.dashboard.nextAppointment.error", "Unable to load appointments")
    : appointment
    ? `${formatDate(appointment.startsAt)} at ${formatTime(appointment.startsAt)}`
    : serverT(dict, "patient.dashboard.nextAppointment.noUpcoming", "No upcoming visits");

  return (
    <Card>
      <CardHeader
        title={serverT(dict, "patient.dashboard.nextAppointment.title", "Next appointment")}
        description={headerDescription}
        action={
          <div className="flex items-center gap-2">
            {appointment ? (
              <LinkButton href="/patient/appointments" variant="outline" size="sm">
                {serverT(dict, "patient.dashboard.nextAppointment.viewAll", "View all")}
              </LinkButton>
            ) : error ? (
              <LinkButton href="/patient/appointments" variant="ghost" size="sm">
                {serverT(dict, "patient.dashboard.nextAppointment.viewAll", "View all")}
              </LinkButton>
            ) : (
              <>
                <LinkButton href="/patient/book" variant="secondary" size="sm">
                  {serverT(dict, "patient.dashboard.nextAppointment.bookVisit", "Book visit")}
                </LinkButton>
                <LinkButton href="/patient/appointments" variant="ghost" size="sm">
                  {serverT(dict, "patient.dashboard.nextAppointment.viewAll", "View all")}
                </LinkButton>
              </>
            )}
          </div>
        }
      />

      {error ? (
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">{serverT(dict, "patient.dashboard.nextAppointment.errorDescription", "We couldn't fetch your appointments. Please try again later.")}</p>
      ) : appointment ? (
        <div className="space-y-4">
          <div className="rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">{serverT(dict, "patient.dashboard.nextAppointment.upcomingVisitLabel", "Upcoming visit")}</p>
                <p className="text-base font-semibold text-[var(--color-ink-900)]">
                  {appointment.doctorName}{appointment.specialty ? `, ${appointment.specialty}` : ""}
                </p>
                <p className="text-sm leading-6 text-[var(--color-ink-600)]">
                  {appointment.location ? appointment.location : serverT(dict, "patient.dashboard.nextAppointment.online", "Online")} {appointment.appointmentType ? ` • ${appointment.appointmentType}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-ink-900)]">{formatDate(appointment.startsAt)}</p>
                <p className="text-sm text-[var(--color-ink-600)]">{formatTime(appointment.startsAt)}</p>
              </div>
            </div>
          </div>
          {/* Actions removed: View details and Reschedule were intentionally removed per request */}
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">
          {serverT(dict, "patient.dashboard.nextAppointment.empty", "You have no appointments scheduled. Book a visit when you are ready from the top actions.")}
        </p>
      )}
    </Card>
  );
}

export async function RecentActivity({ items = [] }: { items?: ActivityItem[] }) {
  const list = Array.isArray(items) ? items.slice(0, 5) : [];

  const dict = await getDictionary();

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

export async function CareTeamSupport({
  clinic,
  doctors = [],
}: {
  clinic?: ClinicSummary | null;
  doctors?: SupportDoctor[];
}) {
  const hasClinic = Boolean(clinic);
  const hasDoctors = Array.isArray(doctors) && doctors.length > 0;

  if (!hasClinic && !hasDoctors) return null;

  const dict = await getDictionary();

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
