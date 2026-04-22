import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getProfiles } from "@/lib/data/supabase";

export default async function StaffPatientsPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return (
      <>
        <PageHeader title="Patient support" description="Service unavailable." />
        <p className="text-sm text-[var(--color-ink-600)]">Supabase client unavailable.</p>
      </>
    );
  }
  const today = new Date().toISOString();
  const { data: appts } = await supabase.from("appointments").select("id, patient_id, appointment_type, starts_at, notes, status").gte("starts_at", today).order("starts_at", { ascending: true }).limit(50);
  const profiles = await getProfiles();

  const rows = (appts ?? []).map((r: any) => {
    const p = (profiles ?? []).find((pp: any) => pp.id === r.patient_id);
    return [p?.full_name ?? r.patient_id, r.appointment_type ?? "", r.notes ?? "", r.status ?? ""];
  });

  return (
    <>
      <PageHeader
        title="Patient support"
        description="Track patient readiness, check-in needs, and accessibility notes before each visit."
      />
      <Table headers={["Patient", "Appointment", "Notes", "Status"]} rows={rows} />
    </>
  );
}
