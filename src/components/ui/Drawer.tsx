"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function Drawer({ open, onClose, children, returnFocusRef }: DrawerProps) {
  // Manage focus restoration to avoid aria-hidden + retained focus accessibility errors.
  const lastActiveRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      // store the element that had focus before opening
      lastActiveRef.current = document.activeElement as HTMLElement | null;
    } else {
      // when closing, restore focus to the provided ref if available, otherwise to the previously focused element
      const restore = () => {
        try {
          if (returnFocusRef?.current) {
            returnFocusRef.current.focus();
            return;
          }
          if (lastActiveRef.current && document.contains(lastActiveRef.current)) {
            lastActiveRef.current.focus();
          }
        } catch (err) {
          // ignore
        }
      };

      // Run restore microtask so any close handlers finish first
      Promise.resolve().then(restore);
    }
  }, [open, returnFocusRef]);

  // Close on Escape and ensure focus is restored before calling onClose
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        try {
          if (returnFocusRef?.current) returnFocusRef.current.focus();
        } catch (err) {}
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, returnFocusRef]);

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
