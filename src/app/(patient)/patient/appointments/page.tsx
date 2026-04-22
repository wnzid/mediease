import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAppointmentsForPatient, getDoctorById, getClinicById } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  // Resolve the canonical profile id for this session user. The auth user id may not equal profiles.id.
  let resolvedProfileId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase && session.user) {
      const uid = session.user.id;
      const email = session.user.email ?? null;

      // 1) Try profiles.id == uid
      const byId = await supabase.from("profiles").select("id").eq("id", uid).maybeSingle();
      if (byId?.data?.id) resolvedProfileId = byId.data.id;
      else {
        // 2) Try profiles.auth_user_id == uid
        const byAuth = await supabase.from("profiles").select("id").eq("auth_user_id", uid).maybeSingle();
        if (byAuth?.data?.id) resolvedProfileId = byAuth.data.id;
        else if (email) {
          // 3) Fallback to email match
          const byEmail = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
          if (byEmail?.data?.id) resolvedProfileId = byEmail.data.id;
        }
      }
    }
  } catch (e) {
    // best-effort; fall back to session id below
  }

  const patientIdToQuery = resolvedProfileId ?? session.user.id;
  const patientAppointments = await getAppointmentsForPatient(patientIdToQuery);

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
