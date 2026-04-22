import { PageHeader } from "@/components/layout/PageHeader";
import { BookingWizard } from "@/components/appointments/BookingWizard";
import { getDoctors, getClinics, appointmentTypes, appointmentModeOptions } from "@/lib/data/supabase";

export default async function PublicBookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const doctorId = typeof params.doctor === "string" ? params.doctor : undefined;

  return (
    <>
      <section className="marketing-section">
        <div className="layout-container">
          <PageHeader
            title="Book an appointment"
            description="Move through a calm, validated booking flow with your summary visible from start to finish."
          />
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
      </section>
    </>
  );
}
