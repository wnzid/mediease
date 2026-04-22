import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NotificationList } from "@/components/feedback/NotificationList";
import { Card, CardHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { getNotificationsForProfile } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";

export default async function StaffDashboardPage() {
  const session = await getSessionContext();
  const notifications = session.user ? await getNotificationsForProfile(session.user.id) : [];

  return (
    <>
      <PageHeader
        title="Clinic staff dashboard"
        description="Watch today's schedule health, patient flow, and clinic coordination from one place."
      />
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Appointments today" value={18} delta="3 require confirmation" />
        <MetricCard label="Doctor schedule changes" value={2} delta="One telehealth block moved" tone="warning" />
        <MetricCard label="Pending check-ins" value={5} delta="Front desk support ready" />
        <MetricCard label="Accessibility requests" value={3} delta="Interpreter and large-print prep" tone="positive" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card className="bg-[var(--color-surface-muted)]">
          <CardHeader title="Today's operational notes" description="Stay ahead of schedule adjustments and patient support needs." />
          <ul className="grid gap-3">
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                <Icon name="file-text" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">Prepare large-print intake sheets for two afternoon visits.</p>
            </li>
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-warning-100)] text-[var(--color-warning-800)]">
                <Icon name="clock-3" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">Confirm Dr. Shah&apos;s telehealth block moved from 1 PM to 2 PM.</p>
            </li>
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">
                <Icon name="calendar-range" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">Review one pending booking that requires manual approval.</p>
            </li>
          </ul>
        </Card>
        <NotificationList items={notifications} title="Operations alerts" />
      </section>
    </>
  );
}
