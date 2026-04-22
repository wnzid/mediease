import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getProfiles } from "@/lib/data/supabase";

export default async function DoctorPatientsPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return (
      <>
        <PageHeader title="Patients" description="Service unavailable." />
        <p className="text-sm text-[var(--color-ink-600)]">Supabase client unavailable.</p>
      </>
    );
  }
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id ?? null;

  if (!uid) {
    return (
      <>
        <PageHeader title="Patients" description="Sign in to view your patients." />
        <p className="text-sm text-[var(--color-ink-600)]">No doctor session detected.</p>
      </>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("id,role").eq("auth_user_id", uid).maybeSingle();
  if (!profile || profile.role !== "doctor") {
    return (
      <>
        <PageHeader title="Patients" description="No doctor profile found." />
        <p className="text-sm text-[var(--color-ink-600)]">No doctor profile detected.</p>
      </>
    );
  }

  // Load recent appointments for this doctor
  const { data: appts } = await supabase.from("appointments").select("id, patient_id, appointment_type, starts_at, notes").eq("doctor_id", profile.id).order("starts_at", { ascending: true }).limit(50);
  const patients = await getProfiles();

  const rows = (appts ?? []).map((r: any) => {
    const p = (patients ?? []).find((pp: any) => pp.id === r.patient_id);
    const patientName = p?.full_name ?? r.patient_id;
    const time = new Date(r.starts_at).toLocaleString();
    return [patientName, r.appointment_type ?? "", time, r.notes ?? ""];
  });

  return (
    <>
      <PageHeader title="Patients" description="A quick operational view of the patient list and upcoming visit context." />
      <Table headers={["Patient", "Visit", "Time", "Notes"]} rows={rows} />
    </>
  );
}
