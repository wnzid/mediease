"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

type ToastTone = "success" | "info" | "warning" | "danger";

type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

const toneClasses: Record<ToastTone, string> = {
  success: "border-[var(--color-success-200)] bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  info: "border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-900)]",
  warning: "border-[var(--color-warning-200)] bg-[var(--color-warning-100)] text-[var(--color-warning-800)]",
  danger: "border-[var(--color-danger-200)] bg-[var(--color-danger-100)] text-[var(--color-danger-700)]",
};

const toneIcons: Record<ToastTone, string> = {
  success: "check_circle",
  info: "info",
  warning: "warning",
  danger: "error",
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reduceMotion = useReducedMotion();

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 5000);
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ addToast, dismissToast }), [addToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[60] grid w-full max-w-sm gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={reduceMotion ? false : { opacity: 0, y: -16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
              className={cn(
                "pointer-events-auto rounded-[var(--radius-panel)] border p-4 shadow-[var(--shadow-panel)]",
                toneClasses[toast.tone],
              )}
              role="status"
            >
              <div className="flex gap-3 items-start">
                <Icon name={toneIcons[toast.tone]} className="w-5 h-5 flex-shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{toast.title}</p>
                  {toast.description ? <p className="mt-1 text-sm opacity-85 truncate">{toast.description}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-full p-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]"
                >
                  <Icon name="close" className="w-4 h-4" aria-hidden />
                  <span className="sr-only">Dismiss notification</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
