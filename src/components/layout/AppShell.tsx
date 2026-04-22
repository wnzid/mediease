import type { AuthUser, UserRole } from "@/types/auth";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { RoleSidebar } from "@/components/layout/RoleSidebar";

export function AppShell({
  role,
  user,
  heading,
  children,
}: {
  role: Exclude<UserRole, "guest">;
  user: AuthUser;
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <AppTopbar role={role} user={user} heading={heading} />

      <div className="flex">
        <RoleSidebar role={role} user={user} />

        <div className="min-w-0 flex-1 pt-[var(--layout-header-height)] bg-[var(--color-surface)]">
          <main id="main-content" className="layout-shell-main grid gap-5 pb-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
