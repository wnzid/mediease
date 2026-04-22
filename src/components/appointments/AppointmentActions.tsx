"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/providers/ToastProvider";
export function AppointmentActions({ appointment }: { appointment?: any | null }) {
  const [mode, setMode] = useState<"reschedule" | "cancel" | null>(null);
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<Array<{ label: string; value: string; isAvailable?: boolean }>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadSlots() {
      if (mode !== "reschedule") return;
      if (!appointment) return;
      setLoadingSlots(true);
      try {
        const date = new Date(appointment.startsAt).toISOString().slice(0, 10);
        const res = await fetch(`/api/doctors/${appointment.doctorId}/available-slots?date=${encodeURIComponent(date)}`);
        const data = await res.json();
        if (!res.ok) {
          setSlots([{ label: data?.error ?? "Failed to load slots", value: "" }]);
        } else {
          const opts = (data?.slots ?? []).map((s: any) => ({ label: new Date(s.startAt).toLocaleString(), value: s.startAt, isAvailable: s.isAvailable }));
          if (opts.length === 0) opts.unshift({ label: "No available slots", value: "" });
          else opts.unshift({ label: "Select a new time", value: "" });
          setSlots(opts);
        }
      } catch (err) {
        setSlots([{ label: "Network error", value: "" }]);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setMode("reschedule")} disabled={!appointment}>
          Reschedule
        </Button>
        <Button variant="ghost" onClick={() => setMode("cancel")}>
          Cancel appointment
        </Button>
      </div>
      <Modal
        open={mode === "reschedule"}
        onClose={() => setMode(null)}
        title="Reschedule appointment"
        description="Choose a new time slot. This loads live doctor availability for the appointment date."
      >
        <div className="grid gap-4">
          <Select label="Available time slots" options={slots} value={slot} onChange={(event) => setSlot(event.target.value)} />
          <Button
            onClick={() => {
              addToast({
                tone: "success",
                title: "Reschedule requested",
                description: slot ? `Requested new time: ${new Date(slot).toLocaleString()}.` : "No slot selected.",
              });
              setMode(null);
            }}
            disabled={!slot}
          >
            Confirm reschedule
          </Button>
        </div>
      </Modal>
      <Modal
        open={mode === "cancel"}
        onClose={() => setMode(null)}
        title="Cancel appointment"
        description="This action will cancel the appointment and notify relevant parties in a production deployment."
      >
        <div className="grid gap-4">
          <p className="text-sm leading-7 text-[var(--color-ink-600)]">
            If you cancel, the status history would be updated and the clinician would be notified.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              addToast({
                tone: "warning",
                title: "Appointment canceled",
                description: "The appointment was canceled.",
              });
              setMode(null);
            }}
          >
            Confirm cancellation
          </Button>
        </div>
      </Modal>
    </>
  );
}
