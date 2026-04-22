import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getAppointmentStatusCounts } from "@/lib/data/supabase";

export default async function AdminAnalyticsPage() {
  const counts = await getAppointmentStatusCounts();

  return (
    <>
      <PageHeader
        title="Analytics"
        description="A presentation-ready analytics placeholder with room for charts, retention, and care access reporting."
      />
      <section className="grid gap-5 md:grid-cols-2">
        {Object.entries(counts).map(([status, count]) => (
          <Card key={status}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{status}</p>
            <p className="mt-4 text-4xl font-semibold text-[var(--color-ink-950)]">{count}</p>
          </Card>
        ))}
      </section>
    </>
  );
}
