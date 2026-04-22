import {
  HeaderSummary,
  ActionCenter,
  NextAppointment,
  RecentActivity,
  HealthSnapshot,
  CareTeamSupport,
} from "@/features/patient/dashboard/DashboardComponents";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUpcomingAppointmentForPatient, getDoctorById, getClinicById } from "@/lib/data/supabase";

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

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData?.user?.id ?? null;
      if (uid) {
        const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", uid).maybeSingle();
        if (profile?.id) {
          const appt = await getUpcomingAppointmentForPatient(profile.id);
          if (appt) {
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
        }
      }
    }
  } catch (e) {
    // ignore server-side failures and fall back to empty dashboard
  }
  const activity: Array<{ id: string; title: string; description?: string; icon?: string }> = [];
  const medicalSummary = undefined;
  const reminders: Array<{ id?: string; title: string; detail?: string; href?: string; critical?: boolean }> = [];
  const profileCompletion = undefined;
  const clinic = null;
  const doctors: Array<{ id: string; name: string; role?: string; phone?: string }> = [];

  return (
    <>
      <HeaderSummary />

      <div className="grid gap-6">
        <ActionCenter profileCompletion={profileCompletion} medicalSummary={medicalSummary} reminders={reminders} />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(21rem,0.92fr)]">
          <div className="grid gap-6">
            <NextAppointment appointment={nextAppointment} />
            <RecentActivity items={activity} />
          </div>

          <div className="grid gap-6">
            <HealthSnapshot prescriptions={undefined} tests={undefined} messages={undefined} />
            <CareTeamSupport clinic={clinic} doctors={doctors} />
          </div>
        </section>
      </div>
    </>
  );
}
