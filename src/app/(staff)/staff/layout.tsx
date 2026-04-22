import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth/session";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("staff");

  return (
    <AppShell role="staff" user={session.user} heading="Dashboard">
      {children}
    </AppShell>
  );
}
