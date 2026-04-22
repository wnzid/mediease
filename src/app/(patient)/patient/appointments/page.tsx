import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAppointmentsForPatientByProfileId, getDoctorById, getClinicById } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { getDictionary, t as serverT } from "@/lib/i18n/server";

export default async function PatientAppointmentsPage() {
  const dict = await getDictionary();
  const session = await getSessionContext();
  if (!session.user) {
    return (
      <>
        <PageHeader title={serverT(dict, "common.appointments", "Appointments")} description={serverT(dict, "patient.appointmentsPage.description", "Track upcoming visits, revisit past appointments, and open each visit for more details.")} />
        <EmptyState icon="calendar_month" title={serverT(dict, "patient.appointmentsPage.signInTitle", "No appointments yet")} description={serverT(dict, "patient.appointmentsPage.signInDescription", "Please sign in to view appointments.")} actionLabel={serverT(dict, "patient.appointmentsPage.signInActionLabel", "Sign in")} actionHref="/sign-in" />
      </>
    );
  }

  // Resolve canonical profile id by email (session -> profiles.email -> profiles.id)
  const userEmail = (session.user.email ?? "").trim().toLowerCase();
  if (!userEmail) {
    return (
      <>
        <PageHeader title={serverT(dict, "common.appointments", "Appointments")} description={serverT(dict, "patient.appointmentsPage.description", "Track upcoming visits, revisit past appointments, and open each visit for more details.")} />
        <EmptyState icon="calendar_month" title={serverT(dict, "patient.appointmentsPage.emptyTitle", "No appointments yet")} description={serverT(dict, "patient.appointmentsPage.emptyDescription", "No email found on your account. Please contact support.")} actionLabel={serverT(dict, "patient.appointmentsPage.emptyActionLabel", "Book an appointment")} actionHref="/patient/book" />
      </>
    );
  }

  // 1) Try to resolve the profile id by email using the server client
  let resolvedProfileId: string | null = null;
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: byEmail } = await supabase.from("profiles").select("id").ilike("email", userEmail).maybeSingle();
      if (byEmail?.id) resolvedProfileId = byEmail.id;
    }
  } catch {
    // silent - fallthrough to service lookup
  }

  // 2) Service-role fallback for profile lookup (only if server lookup failed)
  if (!resolvedProfileId) {
    try {
      const svc = createServiceSupabaseClient();
      if (svc) {
        const { data: svcByEmail } = await svc.from("profiles").select("id").ilike("email", userEmail).maybeSingle();
        if (svcByEmail?.id) resolvedProfileId = svcByEmail.id;
      }
    } catch {}
  }

  // If we still can't resolve a profile id, show empty state (do NOT fall back to auth user id)
  if (!resolvedProfileId) {
    return (
      <>
        <PageHeader title={serverT(dict, "common.appointments", "Appointments")} description={serverT(dict, "patient.appointmentsPage.description", "Track upcoming visits, revisit past appointments, and open each visit for more details.")} />
        <EmptyState icon="calendar_month" title={serverT(dict, "patient.appointmentsPage.emptyTitle", "No appointments yet")} description={serverT(dict, "patient.appointmentsPage.emptyDescription", "We couldn't find a profile attached to your account. Contact support if this seems incorrect.")} actionLabel={serverT(dict, "patient.appointmentsPage.emptyActionLabel", "Book an appointment")} actionHref="/patient/book" />
      </>
    );
  }

  // Fetch appointments for the resolved profile id using the dedicated service helper
  const patientAppointments = await getAppointmentsForPatientByProfileId(resolvedProfileId);

  // Resolve patient display name for print output (server-side)
  let patientName = "You";
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: profileRow } = await supabase.from("profiles").select("full_name").eq("id", resolvedProfileId).maybeSingle();
      if (profileRow?.full_name) patientName = profileRow.full_name;
    }
  } catch {}

  // Group into upcoming and past for a compact, scan-friendly layout
  const now = new Date();
  const upcoming = (patientAppointments ?? []).filter((a) => new Date(a.startsAt) >= now).sort((x, y) => new Date(x.startsAt).getTime() - new Date(y.startsAt).getTime());
  const past = (patientAppointments ?? []).filter((a) => new Date(a.startsAt) < now).sort((x, y) => new Date(y.startsAt).getTime() - new Date(x.startsAt).getTime());

  return (
    <>
      <PageHeader title={serverT(dict, "common.appointments", "Appointments")} description={serverT(dict, "patient.appointmentsPage.description", "Track upcoming visits, revisit past appointments, and open each visit for more details.")} />
      {(upcoming.length > 0 || past.length > 0) ? (
        <div className="grid gap-6">
          {upcoming.length > 0 ? (
            <section>
              <h3 className="mb-3 text-[0.95rem] font-semibold">{serverT(dict, "patient.appointmentsPage.upcoming", "Upcoming")} ({upcoming.length})</h3>
              <div className="grid gap-3">
                {await Promise.all(
                  upcoming.map(async (appointment) => {
                    const doctor = await getDoctorById(appointment.doctorId);
                    const clinic = await getClinicById(appointment.clinicId);
                    return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doctor ?? undefined} clinic={clinic ?? undefined} patientName={patientName} />;
                  }),
                )}
              </div>
            </section>
          ) : null}

          {past.length > 0 ? (
            <section>
              <h3 className="mb-3 text-[0.95rem] font-semibold">{serverT(dict, "patient.appointmentsPage.past", "Past")} ({past.length})</h3>
              <div className="grid gap-3">
                {await Promise.all(
                  past.map(async (appointment) => {
                    const doctor = await getDoctorById(appointment.doctorId);
                    const clinic = await getClinicById(appointment.clinicId);
                    return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doctor ?? undefined} clinic={clinic ?? undefined} patientName={patientName} />;
                  }),
                )}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon="calendar_month"
          title={serverT(dict, "patient.appointmentsPage.emptyTitle", "No appointments yet")}
          description={serverT(dict, "patient.appointmentsPage.emptyDescription", "Once you book an appointment, it will appear here with status updates and visit details.")}
          actionLabel={serverT(dict, "patient.appointmentsPage.emptyActionLabel", "Book an appointment")}
          actionHref="/patient/book"
        />
      )}
    </>
  );
}
