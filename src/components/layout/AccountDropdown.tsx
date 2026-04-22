"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { SignOutButton } from "@/features/auth/SignOutButton";
// role labels omitted from compact account UI to avoid repeating role context
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/lib/i18n/useLocale";
import type { UserRole } from "@/types/auth";

const accountLinks: Record<Exclude<UserRole, "guest">, { href: string; label: string; labelKey?: string }> = {
  patient: { href: "/patient/profile", label: "Profile", labelKey: "common.profile" },
  doctor: { href: "/doctor/profile", label: "Profile", labelKey: "common.profile" },
  staff: { href: "/staff/dashboard", label: "Dashboard", labelKey: "account.dashboard" },
  admin: { href: "/admin/dashboard", label: "Dashboard", labelKey: "account.dashboard" },
};

export function AccountDropdown({
  role,
  user,
}: {
  role: Exclude<UserRole, "guest">;
  user?: { fullName?: string; email?: string };
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const name = user?.fullName ?? "MediEase user";
  const settingsHref = `/${role}/settings`;
  const homeLink = accountLinks[role];
  const { t, locale, setLocale } = useLocale();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-[0.95rem] border border-[var(--color-panel-border)] bg-white px-2.5 transition hover:border-[var(--color-brand-200)] hover:bg-[var(--color-surface-muted)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]",
        )}
      >
        <Avatar name={name} size="sm" />
        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{name}</p>
        </div>
        <Icon name="chevron-right" className={cn("h-4 w-4 text-[var(--color-ink-600)] transition", open ? "rotate-90" : "rotate-0")} aria-hidden />
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-60 rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white p-2 shadow-[var(--shadow-panel)]">
          <div className="border-b border-[var(--color-panel-border)] px-3 pb-3 pt-2">
            <p className="text-sm font-semibold text-[var(--color-ink-900)]">{name}</p>
            {user?.email ? <p className="mt-1 text-xs text-[var(--color-ink-600)]">{user.email}</p> : null}
          </div>

          <div className="grid gap-1 py-2">
            <Link
              href={homeLink.href}
              className="rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-700)] transition hover:bg-[var(--color-panel-muted)] hover:text-[var(--color-ink-950)]"
            >
              {t(homeLink.labelKey ?? homeLink.label)}
            </Link>
            <Link
              href={settingsHref}
              className="rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-700)] transition hover:bg-[var(--color-panel-muted)] hover:text-[var(--color-ink-950)]"
            >
              {t("common.settings")}
            </Link>
          </div>

          <div className="border-t border-[var(--color-panel-border)] px-3 pt-2">
            <p className="mb-2 text-xs font-semibold text-[var(--color-ink-700)]">{t("common.language")}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setLocale("en")}
                className={cn("rounded px-3 py-1 text-sm", locale === "en" ? "font-semibold bg-[var(--color-panel-muted)]" : "")}
              >
                {t("common.english")}
              </button>
              <button
                onClick={() => setLocale("lt")}
                className={cn("rounded px-3 py-1 text-sm", locale === "lt" ? "font-semibold bg-[var(--color-panel-muted)]" : "")}
              >
                {t("common.lithuanian")}
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--color-panel-border)] px-1 pt-2">
            <SignOutButton />
          </div>
        </div>
      ) : null}
    </div>
  );
}
