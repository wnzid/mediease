import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth/session";

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("doctor");

  return (
    <AppShell role="doctor" user={session.user} heading="Dashboard">
      {children}
    </AppShell>
  );
}
