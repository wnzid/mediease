import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { getClinics } from "@/lib/data/supabase";

export default async function AdminClinicsPage() {
  const clinics = await getClinics();
  const rows = clinics.map((clinic) => [clinic.name, `${clinic.city}, ${clinic.state}`, clinic.phone ?? "", (clinic.services ?? []).join(", ")]);

  return (
    <>
      <PageHeader
        title="Clinics"
        description="Review clinic locations, services, and accessibility support coverage."
      />
      <Table headers={["Clinic", "Location", "Phone", "Services"]} rows={rows} />
    </>
  );
}
