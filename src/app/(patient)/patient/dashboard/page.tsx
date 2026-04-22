import {
  DashboardTop,
  ActionCenter,
  NextAppointment,
  RecentActivity,
  HealthSnapshot,
  CareTeamSupport,
} from "@/features/patient/dashboard/DashboardComponents";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getNextUpcomingAppointmentForPatientByEmail, getDoctorById, getClinicById, resolveProfileIdByEmail } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";

export default async function PatientDashboardPage() {
  // Server should provide real data; avoid fake/demo values here.
  let nextAppointment: null | {
    id: string;
    startsAt: string;
    doctorName: string;
    specialty: string;
    location: string;
    appointmentType: string;
  } = null;
  let nextAppointmentError = false;
  
  let patientName = undefined as string | undefined;

  try {
    const session = await getSessionContext();
    const userEmail = (session.user?.email ?? "").trim().toLowerCase();
    if (userEmail) {
      const nextInfo = await getNextUpcomingAppointmentForPatientByEmail(userEmail);
      if (nextInfo && nextInfo.next) {
        const appt = nextInfo.next;
        const doctor = await getDoctorById(appt.doctorId as string);
        const clinic = appt.clinicId ? await getClinicById(appt.clinicId) : null;
        nextAppointment = {
          id: appt.id,
          startsAt: appt.startsAt,
          doctorName: doctor?.fullName ?? "",
          specialty: doctor?.specialty ?? "",
          location: clinic?.name ?? "",
          appointmentType: appt.appointmentType,
        };
      }

      // Resolve display name if possible
      try {
        const resolvedProfileId = await resolveProfileIdByEmail(userEmail);
        if (resolvedProfileId) {
          const supabase = await createServerSupabaseClient();
          if (supabase) {
            const { data: profileRow } = await supabase.from("profiles").select("full_name").eq("id", resolvedProfileId).maybeSingle();
            if (profileRow?.full_name) patientName = profileRow.full_name;
          }
        }
      } catch {}
    }
  } catch (e) {
    // If the shared helper throws, mark error so the card can show an error state
    nextAppointment = null;
    nextAppointmentError = true;
  }
  const activity: Array<{ id: string; title: string; description?: string; icon?: string }> = [];
  const medicalSummary = undefined;
  const reminders: Array<{ id?: string; title: string; detail?: string; href?: string; critical?: boolean }> = [];
  const profileCompletion = undefined;
  const clinic = null;
  const doctors: Array<{ id: string; name: string; role?: string; phone?: string }> = [];

  return (
    <>
      <DashboardTop patientName={patientName} profileCompletion={profileCompletion} nextAppointment={nextAppointment} />

      <div className="grid gap-6 pb-[calc(var(--layout-shell-y)+env(safe-area-inset-bottom))]">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.9fr)]">
          <div className="grid gap-6">
            <NextAppointment appointment={nextAppointment} error={nextAppointmentError} />
            <RecentActivity items={activity} />
          </div>

          <div className="grid gap-6">
            <ActionCenter profileCompletion={profileCompletion} medicalSummary={medicalSummary} reminders={reminders} />
            <HealthSnapshot prescriptions={undefined} tests={undefined} messages={undefined} />
            <CareTeamSupport clinic={clinic} doctors={doctors} />
          </div>
        </section>
      </div>
    </>
  );
}
