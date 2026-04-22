import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAppointmentsForPatient, getDoctorById, getClinicById } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";

export default async function PatientAppointmentsPage() {
  const session = await getSessionContext();
  if (!session.user) {
    return (
      <>
        <PageHeader title="Appointments" description="Track upcoming visits, revisit past appointments, and open each visit for more details." />
        <EmptyState icon="calendar_month" title="No appointments yet" description="Please sign in to view appointments." actionLabel="Sign in" actionHref="/sign-in" />
      </>
    );
  }

  const patientAppointments = await getAppointmentsForPatient(session.user.id);

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Track upcoming visits, revisit past appointments, and open each visit for more details."
      />
      {patientAppointments.length > 0 ? (
        <section className="grid gap-5">
          {await Promise.all(
            patientAppointments.map(async (appointment) => {
              const doctor = await getDoctorById(appointment.doctorId);
              const clinic = await getClinicById(appointment.clinicId);
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  href={`/patient/appointments/${appointment.id}`}
                  doctor={doctor ?? undefined}
                  clinic={clinic ?? undefined}
                />
              );
            }),
          )}
        </section>
      ) : (
        <EmptyState
          icon="calendar_month"
          title="No appointments yet"
          description="Once you book an appointment, it will appear here with status updates and visit details."
          actionLabel="Book an appointment"
          actionHref="/patient/book"
        />
      )}
    </>
  );
}
