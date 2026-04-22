import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Logo } from "@/components/layout/Logo";
import { requireRole } from "@/lib/auth/session";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireRole("patient");

  return (
    <AppShell
      role="patient"
      user={session.user}
      heading={<Logo variant="landscape" size={150} alt="MediEase" />}
    >
      {children}
    </AppShell>
  );
}
