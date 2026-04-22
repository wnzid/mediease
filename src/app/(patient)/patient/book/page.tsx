import { PageHeader } from "@/components/layout/PageHeader";
import { BookingWizard } from "@/components/appointments/BookingWizard";
import { getDoctors, getClinics, appointmentTypes, appointmentModeOptions } from "@/lib/data/supabase";
import { getDictionary, t as serverT } from "@/lib/i18n/server";

export default async function PatientBookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const doctorId = typeof params.doctor === "string" ? params.doctor : undefined;
  return (
    <>
      <div className="layout-container">
        {
          (await (async () => {
            const dict = await getDictionary();
            return (
              <PageHeader
                title={serverT(dict, "patient.booking.title", "Book an appointment")}
                description={serverT(dict, "patient.booking.description", "Move through a calm, validated booking flow with your summary visible from start to finish.")}
              />
            );
          })())
        }
        <div className="mt-6">
          <BookingWizard
            initialDoctorId={doctorId}
            doctors={await getDoctors()}
            clinics={await getClinics()}
            appointmentTypes={appointmentTypes}
            appointmentModeOptions={appointmentModeOptions}
          />
        </div>
      </div>
    </>
  );
}
