"use client";

import { useCallback, useState } from "react";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Alert } from "@/components/ui/Alert";
import { formatDate, formatTime, formatLongDate, formatDateTimeRange } from "@/lib/formatting/date";
import type { Appointment } from "@/types/appointments";
import { useI18n } from "@/lib/i18n/provider";

export function AppointmentCard({
  appointment,
  doctor,
  clinic,
  patientName,
}: {
  appointment: Appointment;
  doctor?: { fullName?: string } | null;
  clinic?: { name?: string } | null;
  patientName?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const { t } = useI18n();

  const handlePrint = useCallback(() => {
    setPrintError(null);

    function escapeHtml(input?: string | null) {
      if (!input) return "";
      return String(input).replace(/[&<>\"']/g, (c) => {
        switch (c) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&#39;";
          default:
            return c;
        }
      });
    }

    const patient = escapeHtml(patientName ?? t("patient.appointmentCard.patient", "Patient"));
    const doctorName = escapeHtml(doctor?.fullName ?? t("patient.appointmentCard.assignedClinician", "Assigned clinician"));
    const clinicName = escapeHtml(clinic?.name ?? "—");
    const reference = escapeHtml(appointment.reference ?? "");
    const reason = escapeHtml(appointment.reason ?? "");
    const notes = escapeHtml(appointment.notes ?? "");
    const created = appointment.createdAt ? `${escapeHtml(formatLongDate(appointment.createdAt))} ${escapeHtml(formatTime(appointment.createdAt))}` : "";

    const brandLabel = escapeHtml(t("common.brand", "MediEase"));
    const appointmentLabel = escapeHtml(t("patient.appointmentCard.appointmentDetails", "Appointment Details"));
    const title = `${brandLabel} — ${appointmentLabel}${reference ? ` • ${reference}` : ""}`;
    const bookingRefLabel = escapeHtml(t("patient.appointmentCard.bookingReference", "Booking reference"));
    const patientLabel = escapeHtml(t("patient.appointmentCard.patient", "Patient"));
    const doctorLabel = escapeHtml(t("patient.appointmentCard.doctor", "Doctor"));
    const clinicLabel = escapeHtml(t("patient.appointmentCard.clinicLocation", "Clinic / Location"));
    const whenLabel = escapeHtml(t("patient.appointmentCard.when", "When"));
    const statusLabel = escapeHtml(t("patient.appointmentCard.status", "Status"));
    const typeLabel = escapeHtml(t("patient.appointmentCard.type", "Type"));
    const modeLabel = escapeHtml(t("patient.appointmentCard.mode", "Mode"));
    const reasonHeading = escapeHtml(t("patient.appointmentCard.reason", "Reason"));
    const notesHeading = escapeHtml(t("patient.appointmentCard.notes", "Notes"));
    const bookedAtLabel = escapeHtml(t("patient.appointmentCard.bookedAt", "Booked at"));
    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          :root{color-scheme: light}
          html,body{height:100%}
          body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;padding:28px;background:#fff}
          header{display:flex;align-items:center;gap:12px;margin-bottom:18px}
          .brand{font-weight:700;font-size:20px;color:#062b57}
          .muted{color:#475569}
          .section{margin:12px 0;padding:6px 0}
          .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f5f9}
          .label{font-weight:600;color:#0f172a;width:40%}
          .value{width:60%;text-align:right}
          h2{font-size:14px;margin:8px 0}
          @media print{body{padding:12px} .no-print{display:none}}
        </style>
      </head>
      <body>
        <header>
          <div class="brand">${brandLabel}</div>
          <div class="muted">${appointmentLabel}</div>
        </header>

        <main>
          <div class="section">
            <div class="row"><div class="label">${bookingRefLabel}</div><div class="value">${reference || "—"}</div></div>
            <div class="row"><div class="label">${patientLabel}</div><div class="value">${patient}</div></div>
            <div class="row"><div class="label">${doctorLabel}</div><div class="value">${doctorName}</div></div>
            <div class="row"><div class="label">${clinicLabel}</div><div class="value">${clinicName}</div></div>
            <div class="row"><div class="label">${whenLabel}</div><div class="value">${escapeHtml(formatDateTimeRange(appointment.startsAt, appointment.endsAt))}</div></div>
            <div class="row"><div class="label">${statusLabel}</div><div class="value">${escapeHtml(appointment.status)}</div></div>
            <div class="row"><div class="label">${typeLabel}</div><div class="value">${escapeHtml(appointment.appointmentType)}</div></div>
            <div class="row"><div class="label">${modeLabel}</div><div class="value">${escapeHtml(appointment.mode)}</div></div>
          </div>

          <div class="section">
            <h2>${reasonHeading}</h2>
            <div class="muted">${reason || "—"}</div>
          </div>

          ${notes ? `<div class="section"><h2>${notesHeading}</h2><div class="muted">${notes}</div></div>` : ""}

          ${created ? `<div class="section"><div class="row"><div class="label">${bookedAtLabel}</div><div class="value">${created}</div></div></div>` : ""}

        </main>
        <script>
          (function(){
            try{ window.focus(); window.print(); }catch(e){/* noop */}
          })();
        </script>
      </body>
      </html>`;

    // Try opening a new window first (user gesture). If blocked, fallback to an iframe print.
    try {
      const w = window.open("", "_blank", "width=800,height=600");
      if (w) {
        w.document.open();
        w.document.write(html);
        w.document.close();
        const doPrint = () => {
          try {
            w.focus();
            w.print();
          } catch (e) {
            setPrintError("Unable to open print view. Please allow popups and try again.");
          }
        };
        if (w.document.readyState === "complete") doPrint();
        else w.addEventListener("load", doPrint);
        // Close after print if the browser supports afterprint
        try { w.addEventListener("afterprint", () => { try { w.close(); } catch{} }); } catch {}
        return;
      }
    } catch (e) {
      // ignore and try iframe fallback
    }

    // Fallback: hidden iframe print (avoids popup blocker issues in some browsers)
    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
      const idoc = iframe.contentWindow?.document;
      if (!idoc) throw new Error("print-unavailable");
      idoc.open();
      idoc.write(html);
      idoc.close();
      const win = iframe.contentWindow!;
      try {
        win.focus();
        win.print();
      } catch (err) {
        setPrintError("Unable to open print view. Please allow popups and try again.");
      }
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch {}
      }, 2000);
    } catch (err) {
      setPrintError("Unable to open print view. Please allow popups and try again.");
    }
  }, [appointment, clinic?.name, doctor?.fullName, patientName]);

  return (
    <Card className="p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-ink-950)]">{doctor?.fullName ?? t("patient.appointmentCard.assignedClinician", "Assigned clinician")}</h3>
              <div className="mt-1 text-xs text-[var(--color-ink-600)]">
                {formatDate(appointment.startsAt)} · {formatTime(appointment.startsAt)} · {clinic?.name ?? "—"}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-[var(--color-panel-muted)] text-[var(--color-ink-700)] text-[11px]">{appointment.appointmentType}</Badge>
            <Badge className="bg-[var(--color-panel-muted)] text-[var(--color-ink-700)] text-[11px]">{appointment.mode}</Badge>
            <p className="ml-2 text-sm text-[var(--color-ink-700)] truncate max-w-[48ch]">{appointment.reason ?? t("patient.appointmentCard.noReasonProvided", "No reason provided")}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button variant="ghost" size="sm" onClick={toggle} iconRight={open ? "chevron-right" : "chevron-right"} className="px-3">
            {open ? t("patient.appointmentCard.hide", "Hide") : t("patient.appointmentCard.viewDetails", "View details")}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="mt-3 border-t border-[var(--color-panel-border)] pt-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.bookingReference", "Reference")}</p>
              <p className="mt-1 text-[var(--color-ink-800)]">{appointment.reference ?? "—"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.status", "Status")}</p>
              <p className="mt-1 text-[var(--color-ink-800)]">{appointment.status}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.when", "When")}</p>
              <p className="mt-1 text-[var(--color-ink-800)]">{formatDateTimeRange(appointment.startsAt, appointment.endsAt)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.mode", "Mode")}</p>
              <p className="mt-1 text-[var(--color-ink-800)]">{appointment.mode}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.reason", "Reason")}</p>
              <p className="mt-1 text-[var(--color-ink-700)]">{appointment.reason ?? "—"}</p>
            </div>
            {appointment.notes ? (
              <div className="col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-600)]">{t("patient.appointmentCard.notes", "Notes")}</p>
                <p className="mt-1 text-[var(--color-ink-700)]">{appointment.notes}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} iconLeft="file-text">
              {t("patient.appointmentCard.printSave", "Print / Save PDF")}
            </Button>
            {printError ? (
              <div className="w-full mt-2">
                <Alert tone="warning" title="Unable to open print view" description={printError} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
