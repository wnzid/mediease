"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 transition",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-2xl rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white p-[var(--space-card)] shadow-[var(--shadow-panel)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]" id="modal-title">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-control)] p-2 text-[var(--color-ink-700)] transition hover:bg-[var(--color-panel-muted)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]"
          >
            <Icon name="close" className="h-[18px] w-[18px]" aria-hidden />
            <span className="sr-only">Close dialog</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
