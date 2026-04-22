import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { NotificationList } from "@/components/feedback/NotificationList";
import { Card, CardHeader } from "@/components/ui/Card";
import { getDoctors, getAppointmentsForDoctor, getNotificationsForProfile, getDoctorById, getClinicById } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";

export default async function DoctorDashboardPage() {
  const session = await getSessionContext();
  const doctors = await getDoctors();
  const doctor = session.user ? doctors.find((d) => d.profileId === session.user?.id) ?? doctors[0] : doctors[0];
  const doctorAppointments = doctor ? await getAppointmentsForDoctor(doctor.id) : [];
  const notifications = session.user ? await getNotificationsForProfile(session.user.id) : [];

  return (
    <>
      <PageHeader
        title={`Good morning, ${doctor?.fullName ?? "clinician"}`}
        description="Today's schedule, pending requests, and care preparation are organized here."
      />
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's visits" value={doctorAppointments.length} delta="2 confirmed, 1 pending" />
        <MetricCard label="Telehealth sessions" value={2} delta="Caption-ready" tone="positive" />
        <MetricCard label="Pending requests" value={1} delta="Needs review before 4 PM" tone="warning" />
        <MetricCard label="Availability blocks" value={3} delta="Updated this week" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5">
          {await Promise.all(
            doctorAppointments.map(async (appointment) => {
              const doc = await getDoctorById(appointment.doctorId);
              const clinic = await getClinicById(appointment.clinicId);
              return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doc ?? undefined} clinic={clinic ?? undefined} />;
            }),
          )}
          <Card className="bg-[var(--color-surface-muted)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-700)]">At a glance</p>
            <CardHeader title="Patient summary" description="Key preparation context before you start the clinic day." />
            <div className="rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white p-4">
              {
                (function renderSummary() {
                  const next = doctorAppointments[0];
                  if (!next) return <p className="text-sm text-[var(--color-ink-600)]">No patient summary available for today.</p>;
                  return (
                    <>
                      <p className="text-base font-semibold text-[var(--color-ink-900)]">{next.patientId}</p>
                      <p className="mt-1 text-base leading-7 text-[var(--color-ink-600)]">{next.notes ?? "No additional notes."}</p>
                    </>
                  );
                })()
              }
            </div>
          </Card>
        </div>
        <NotificationList items={notifications} />
      </section>
    </>
  );
}
