import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("admin");

  return (
    <AppShell role="admin" user={session.user} heading="">
      {children}
    </AppShell>
  );
}
