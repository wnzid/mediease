"use client";

import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useEffect } from "react";
import { LocaleProvider } from "@/lib/i18n/provider";

export function AppProviders({ children, initialLocale }: { children: React.ReactNode; initialLocale?: string }) {
  useEffect(() => {
    function safeStringify(value: unknown) {
      try {
        const res = JSON.stringify(value);
        if (res === undefined) return String(value);
        return res;
      } catch {
        try {
          return String(value);
        } catch {
          return "(unserializable)";
        }
      }
    }

    function handleError(ev: ErrorEvent) {
      try {
        const payload = {
          type: "error",
          message: ev.message,
          filename: ev.filename,
          lineno: ev.lineno,
          colno: ev.colno,
          errorName: ev.error?.name ?? null,
          stack: ev.error?.stack ?? null,
          errorObject: safeStringify(ev.error),
          url: typeof window !== "undefined" ? window.location.href : null,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        };

        // local console for immediate visibility - serialize to capture a snapshot
        // eslint-disable-next-line no-console
        const payloadStr = safeStringify(payload);
        console.error("[client-error capture]", payloadStr, "rawEvent:", {
          message: ev.message,
          filename: ev.filename,
          lineno: ev.lineno,
          colno: ev.colno,
          error: ev.error,
        });

        void fetch("/api/client-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadStr,
        });
      } catch (e) {
        // swallow
      }
    }

    function handleRejection(ev: PromiseRejectionEvent) {
      try {
        const payload = {
          type: "unhandledrejection",
          message: String(ev.reason?.message ?? ev.reason),
          stack: ev.reason?.stack ?? null,
          reason: safeStringify(ev.reason),
          url: typeof window !== "undefined" ? window.location.href : null,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        };

        // eslint-disable-next-line no-console
        const payloadStr = safeStringify(payload);
        console.error("[client-unhandledrejection capture]", payloadStr, "rawReason:", ev.reason);

        void fetch("/api/client-error", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadStr,
        });
      } catch (e) {
        // swallow
      }
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return (
    <AccessibilityProvider>
      <LocaleProvider initialLocale={initialLocale as any}>
        <ToastProvider>{children}</ToastProvider>
      </LocaleProvider>
    </AccessibilityProvider>
  );
}
