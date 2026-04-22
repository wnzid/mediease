"use client";

import { cn } from "@/lib/utils/cn";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-slate-950/40 transition md:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <aside
        className={cn(
          "absolute left-0 top-0 h-full w-[min(18rem,86vw)] border-r border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] p-4 shadow-[var(--shadow-panel)] transition",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </aside>
    </div>
  );
}
