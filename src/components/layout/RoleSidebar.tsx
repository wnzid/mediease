"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavigation, roleHomePaths } from "@/lib/constants/navigation";
import { useLocale } from "@/lib/i18n/useLocale";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { AuthUser, UserRole } from "@/types/auth";
import { cn } from "@/lib/utils/cn";

export function RoleSidebar({
  role,
  user,
  mobile = false,
  onNavigate,
}: {
  role: Exclude<UserRole, "guest">;
  user: AuthUser;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside
      className={cn(
        "border-[var(--color-panel-border)] bg-[var(--color-surface-muted)]",
        mobile
          ? "block h-full w-full border-r-0 bg-transparent"
          : "sticky top-[var(--layout-header-height)] hidden h-[calc(100vh-var(--layout-header-height))] w-[var(--layout-sidebar-width)] shrink-0 border-r xl:block",
      )}
    >
      <div className={cn("flex h-full flex-col", mobile ? "px-1 py-1" : "px-3.5 py-4")}>
        <div />

        <nav className="mt-4 grid gap-1">
          {appNavigation[role].map((item) => {
            const matchMode = item.match ?? "startsWith";
            const active =
              matchMode === "exact" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && onNavigate?.()}
                className={cn(
                  "group flex min-h-10 items-center justify-between gap-3 rounded-[0.9rem] px-2.5 text-sm font-medium transition",
                  active
                    ? "border border-[var(--color-brand-100)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                    : "text-[var(--color-ink-700)] hover:bg-white/70 hover:text-[var(--color-ink-950)]",
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-[0.8rem] transition",
                      active
                        ? "bg-white text-[var(--color-brand-700)]"
                        : "bg-transparent text-[var(--color-ink-700)] group-hover:bg-white/80",
                    )}
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="truncate">{t(item.labelKey ?? item.title)}</span>
                </span>
                {item.badge ? <Badge className="bg-[var(--color-surface-muted)] text-[var(--color-ink-700)]">{item.badge}</Badge> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
