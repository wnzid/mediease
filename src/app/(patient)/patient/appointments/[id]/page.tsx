import { notFound } from "next/navigation";
import { AppointmentActions } from "@/components/appointments/AppointmentActions";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getAppointmentById, getClinicById, getDoctorById } from "@/lib/data/supabase";

export default async function PatientAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const doctor = await getDoctorById(appointment.doctorId);
  const clinic = await getClinicById(appointment.clinicId);

  return (
    <>
      <PageHeader
        title="Appointment details"
        description="Review care instructions, appointment status, and next steps."
        breadcrumbItems={[
          { label: "Appointments", href: "/patient/appointments" },
          { label: "Details" },
        ]}
      />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5">
          <AppointmentCard appointment={appointment} doctor={doctor ?? undefined} clinic={clinic ?? undefined} />
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">Visit instructions</h2>
            <p className="mt-3 text-base leading-7 text-[var(--color-ink-600)]">
              {appointment.notes ?? "Bring any recent measurements, medication questions, or notes you want to discuss during the visit."}
            </p>
          </Card>
        </div>
        <div className="grid gap-5">
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">Care team</h2>
            <p className="mt-3 text-base text-[var(--color-ink-700)]">{doctor?.fullName}</p>
            <p className="mt-1 text-sm text-[var(--color-ink-600)]">{doctor?.specialty}</p>
            <p className="mt-4 text-base text-[var(--color-ink-700)]">{clinic?.name}</p>
            <p className="mt-1 text-sm leading-7 text-[var(--color-ink-600)]">{clinic?.address}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">Manage appointment</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-600)]">
              Reschedule and cancel actions are available here. In a live Supabase-backed deployment, each action would write to appointment status history.
            </p>
            <div className="mt-4">
              <AppointmentActions appointment={appointment} />
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
