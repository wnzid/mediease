"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Drawer } from "@/components/ui/Drawer";
import { Button, LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RoleSidebar } from "@/components/layout/RoleSidebar";
import { Logo } from "@/components/layout/Logo";
import { AccountDropdown } from "@/components/layout/AccountDropdown";
import { useLocale } from "@/lib/i18n/useLocale";
// role labels are intentionally omitted from the topbar to reduce redundancy
import type { AuthUser, UserRole } from "@/types/auth";

const quickActions: Record<Exclude<UserRole, "guest">, { href: string; label: string; labelKey?: string; icon: string }> = {
  patient: { href: "/patient/book", label: "Book visit", labelKey: "common.book", icon: "calendar-days" },
  doctor: { href: "/doctor/availability", label: "Availability", labelKey: "nav.availability", icon: "clock-3" },
  staff: { href: "/staff/appointments", label: "Appointments", labelKey: "nav.appointments", icon: "calendar-range" },
  admin: { href: "/admin/users", label: "Manage users", labelKey: "nav.users", icon: "users-round" },
};

export function AppTopbar({
  role,
  user,
  heading,
}: {
  role: Exclude<UserRole, "guest">;
  user: AuthUser;
  heading: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const quickAction = quickActions[role];
  const { t } = useLocale();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-panel-border)] bg-white/96 pointer-events-auto">
        <div className="layout-container flex h-[var(--layout-header-height)] items-center justify-between gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Button ref={menuButtonRef} variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setOpen(true)}>
              <Icon name="menu" className="h-[18px] w-[18px]" aria-hidden />
              <span className="sr-only">Open navigation</span>
            </Button>
            <LinkButton href="/" aria-label="Go home" variant="ghost" size="icon-sm" className="inline-flex items-center">
              <Icon name="home" className="h-[18px] w-[18px]" aria-hidden />
              <span className="sr-only">Go home</span>
            </LinkButton>
            <Link href="/" aria-label="MediEase home" className="inline-flex lg:hidden items-center h-[var(--layout-header-height)] cursor-pointer">
              <Logo variant="icon" size="md" />
            </Link>
            <div className="min-w-0 hidden lg:flex lg:items-center">
              {(() => {
                if (typeof heading === "string" || typeof heading === "number") {
                  return (
                    <p className="truncate text-[1.15rem] font-semibold leading-tight text-[var(--color-ink-950)]">{heading}</p>
                  );
                }

                // If the heading is a Logo or a component, render it only on lg+.
                const isLogoElement = React.isValidElement(heading) && typeof (heading as any).props?.variant === "string";

                if (isLogoElement) {
                  return (
                    <Link href="/" aria-label="MediEase home" className="min-w-0 inline-flex items-center h-[var(--layout-header-height)] cursor-pointer">
                      {heading}
                    </Link>
                  );
                }

                return <div className="min-w-0 flex items-center">{heading}</div>;
              })()}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LinkButton
              href={quickAction.href}
              variant="primary"
              size="md"
              iconLeft={quickAction.icon}
              className="hidden md:inline-flex"
            >
              {t(quickAction.labelKey ?? quickAction.label)}
            </LinkButton>
            <AccountDropdown role={role} user={user} />
          </div>
        </div>
      </header>

      <Drawer
        open={open}
        onClose={() => {
          try {
            menuButtonRef.current?.focus();
          } catch (err) {}
          setOpen(false);
        }}
        returnFocusRef={menuButtonRef}
      >
        <RoleSidebar role={role} user={user} mobile onNavigate={() => {
          try { menuButtonRef.current?.focus(); } catch (err) {}
          setOpen(false);
        }} />
      </Drawer>
    </>
  );
}
