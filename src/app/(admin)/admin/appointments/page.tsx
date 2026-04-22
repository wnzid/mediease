import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminAppointmentsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: appointments } = supabase ? await supabase.from("appointments").select("id,reference,status,appointment_type,mode,starts_at") : { data: [] };
  const rows = (appointments ?? []).map((appointment: any) => [appointment.reference ?? appointment.id, appointment.status, appointment.appointment_type, appointment.mode, (appointment.starts_at || "").slice(0, 10)]);

  return (
    <>
      <PageHeader
        title="Appointments"
        description="Audit booking status, visit types, and platform-level appointment health."
      />
      <Table headers={["Ref", "Status", "Type", "Mode", "Date"]} rows={rows} />
    </>
  );
}
