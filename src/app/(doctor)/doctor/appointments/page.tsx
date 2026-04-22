import { PageHeader } from "@/components/layout/PageHeader";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { getDoctors, getAppointmentsForDoctorGrouped, getDoctorById, getClinicById } from "@/lib/data/supabase";
import { getSessionContext } from "@/lib/auth/session";

export default async function DoctorAppointmentsPage() {
  const session = await getSessionContext();
  const doctors = await getDoctors();
  const doctor = doctors.find((d) => d.profileId === session.user?.id) ?? doctors[0];
  const grouped = doctor ? await getAppointmentsForDoctorGrouped(doctor.id) : { today: [], upcoming: [], past: [], canceled: [], all: [] };

  return (
    <>
      <PageHeader title="Appointments" description="Review upcoming consultations, status changes, and visit reasons." />
      <section className="grid gap-6">
        {grouped.today.length > 0 ? (
          <div>
            <h3 className="mb-3 text-lg font-semibold">Today</h3>
            <div className="grid gap-4">
              {await Promise.all(
                grouped.today.map(async (appointment) => {
                  const doc = await getDoctorById(appointment.doctorId);
                  const clinic = await getClinicById(appointment.clinicId);
                  return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doc ?? undefined} clinic={clinic ?? undefined} />;
                }),
              )}
            </div>
          </div>
        ) : null}

        {grouped.upcoming.length > 0 ? (
          <div>
            <h3 className="mb-3 text-lg font-semibold">Upcoming</h3>
            <div className="grid gap-4">
              {await Promise.all(
                grouped.upcoming.map(async (appointment) => {
                  const doc = await getDoctorById(appointment.doctorId);
                  const clinic = await getClinicById(appointment.clinicId);
                  return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doc ?? undefined} clinic={clinic ?? undefined} />;
                }),
              )}
            </div>
          </div>
        ) : null}

        {grouped.past.length > 0 ? (
          <div>
            <h3 className="mb-3 text-lg font-semibold">Past</h3>
            <div className="grid gap-4">
              {await Promise.all(
                grouped.past.map(async (appointment) => {
                  const doc = await getDoctorById(appointment.doctorId);
                  const clinic = await getClinicById(appointment.clinicId);
                  return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doc ?? undefined} clinic={clinic ?? undefined} />;
                }),
              )}
            </div>
          </div>
        ) : null}

        {grouped.canceled.length > 0 ? (
          <div>
            <h3 className="mb-3 text-lg font-semibold">Canceled</h3>
            <div className="grid gap-4">
              {await Promise.all(
                grouped.canceled.map(async (appointment) => {
                  const doc = await getDoctorById(appointment.doctorId);
                  const clinic = await getClinicById(appointment.clinicId);
                  return <AppointmentCard key={appointment.id} appointment={appointment} doctor={doc ?? undefined} clinic={clinic ?? undefined} />;
                }),
              )}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
