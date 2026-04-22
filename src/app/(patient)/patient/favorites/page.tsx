import { PageHeader } from "@/components/layout/PageHeader";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { getDoctors, getClinics } from "@/lib/data/supabase";

export default async function PatientFavoritesPage() {
  const doctors = await getDoctors();
  const clinics = await getClinics();

  return (
    <>
      <PageHeader
        title="Saved doctors"
        description="Keep trusted clinicians close for easier rebooking and care continuity."
      />
      <section className="grid gap-5">
        {doctors.slice(0, 3).map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} primaryClinicName={clinics.find((c) => doctor.clinicIds.includes(c.id))?.name ?? undefined} />
        ))}
      </section>
    </>
  );
}
