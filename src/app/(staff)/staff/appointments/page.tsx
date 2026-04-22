import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getProfiles, getDoctors } from "@/lib/data/supabase";

export default async function StaffAppointmentsPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return (
      <>
        <PageHeader title="Appointment overview" description="Service unavailable." />
        <p className="text-sm text-[var(--color-ink-600)]">Supabase client unavailable.</p>
      </>
    );
  }

  const { data: rows } = await supabase.from("appointments").select("id, patient_id, doctor_id, status, starts_at, mode").order("starts_at", { ascending: true }).limit(50);
  const patients = await getProfiles();
  const doctors = await getDoctors();

  const tableRows = (rows ?? []).map((r: any) => {
    const p = (patients ?? []).find((pp: any) => pp.id === r.patient_id);
    const d = (doctors ?? []).find((dd: any) => dd.id === r.doctor_id);
    return [p?.full_name ?? r.patient_id, d?.fullName ?? r.doctor_id, r.status ?? "", new Date(r.starts_at).toLocaleString(), r.mode ?? ""];
  });

  return (
    <>
      <PageHeader title="Appointment overview" description="Monitor booking status, doctor assignments, and visit mode from the staff workspace." />
      <Table headers={["Patient", "Doctor", "Status", "Time", "Mode"]} rows={tableRows} />
    </>
  );
}
