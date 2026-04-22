import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { getAppointmentStatusCounts } from "@/lib/data/supabase";

export default async function AdminDashboardPage() {
  const counts = await getAppointmentStatusCounts();

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Watch user growth, appointment health, clinic activity, and operational risk areas from one admin dashboard."
      />
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={482} delta="+14 this month" tone="positive" />
        <MetricCard label="Doctors onboarded" value={68} delta="3 pending verification" />
        <MetricCard label="Appointments booked" value={(counts.confirmed ?? 0) + (counts.pending ?? 0)} delta="Strong weekly volume" />
        <MetricCard label="Active clinics" value={14} delta="2 added this quarter" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card className="bg-[var(--color-surface-muted)]">
          <CardHeader title="Issue flags" description="Critical operational checks that still need platform review." />
          <ul className="grid gap-3">
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-warning-100)] text-[var(--color-warning-800)]">
                <Icon name="warning" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">3 clinicians pending verification review.</p>
            </li>
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                <Icon name="accessibility" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">2 clinics need updated accessibility statements.</p>
            </li>
            <li className="flex items-start gap-3 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-3.5 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-[0.8rem] bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">
                <Icon name="bar-chart-3" className="h-[18px] w-[18px]" aria-hidden />
              </div>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">1 appointment cluster has elevated cancellation volume.</p>
            </li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Analytics snapshot" description="A compact read on current appointment volume by status." />
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] px-3.5 py-3">
              <span className="text-sm text-[var(--color-ink-700)]">Confirmed appointments</span>
              <span className="text-lg font-semibold text-[var(--color-ink-950)]">{counts.confirmed}</span>
            </div>
            <div className="flex items-center justify-between rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] px-3.5 py-3">
              <span className="text-sm text-[var(--color-ink-700)]">Pending appointments</span>
              <span className="text-lg font-semibold text-[var(--color-ink-950)]">{counts.pending}</span>
            </div>
            <div className="flex items-center justify-between rounded-[0.95rem] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] px-3.5 py-3">
              <span className="text-sm text-[var(--color-ink-700)]">Completed appointments</span>
              <span className="text-lg font-semibold text-[var(--color-ink-950)]">{counts.completed}</span>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
