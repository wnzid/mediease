import { PublicBookPageContent } from "@/features/marketing/LocalizedPages";
import { getDoctors, getClinics, appointmentTypes, appointmentModeOptions } from "@/lib/data/supabase";

export default async function PublicBookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const doctorId = typeof params.doctor === "string" ? params.doctor : undefined;

  return (
    <PublicBookPageContent
      doctorId={doctorId}
      doctors={await getDoctors()}
      clinics={await getClinics()}
      appointmentTypes={appointmentTypes}
      appointmentModeOptions={appointmentModeOptions}
    />
  );
}
