import { PageHeader } from "@/components/layout/PageHeader";
import { Table } from "@/components/ui/Table";
import AdminUserActions from "@/features/admin/AdminUserActions";
import { getProfiles } from "@/lib/data/supabase";

export default async function AdminUsersPage() {
  const profiles = await getProfiles();
  const rows = (profiles ?? []).map((profile: any) => {
    const created = profile?.created_at ? new Date(profile.created_at).toLocaleString() : "";
    return [profile.full_name ?? profile.fullName ?? "", profile.email ?? "", profile.role ?? "", profile.location ?? "", created];
  });

  return (
    <>
      <PageHeader
        title="Users"
        description="Review platform users across patient, doctor, staff, and admin roles."
        actions={<AdminUserActions />}
      />
      <Table headers={["Name", "Email", "Role", "Location", "Created"]} rows={rows} />
    </>
  );
}
