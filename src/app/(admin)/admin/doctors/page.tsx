import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";

import { getDoctors } from "@/lib/data/supabase";

export default async function AdminDoctorsPage() {
  const doctors = await getDoctors();
  const rows = doctors.map((doctor) => [doctor.fullName ?? "", doctor.specialty ?? "", String(doctor.yearsExperience ?? ""), (doctor.languages ?? []).join(", ")]);

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Manage clinician roster, specialties, verification status, and patient availability signals."
      />
      <Table headers={["Name", "Specialty", "Years", "Languages"]} rows={rows} />
    </>
  );
}
