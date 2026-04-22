"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/providers/ToastProvider";

export function AvailabilityEditor() {
  const { addToast } = useToast();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<any[]>([]);

  const [form, setForm] = useState({ availabilityDate: "", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, appointmentMode: "in-person", notes: "" });

  async function loadDoctor() {
    try {
      const res = await fetch(`/api/doctors/me`);
      const data = await res.json();
      if (res.ok && data?.doctorId) {
        setDoctorId(data.doctorId);
        return data.doctorId;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  async function loadAvailabilities(dId?: string) {
    const id = dId ?? doctorId;
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${id}/availability`);
      const data = await res.json();
      if (res.ok) setAvailabilities(data?.availability ?? []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const id = await loadDoctor();
      if (id) loadAvailabilities(id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateForm<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleCreate() {
    if (!doctorId) return addToast({ tone: "danger", title: "Error", description: "No doctor session found." });
    if (!form.availabilityDate) return addToast({ tone: "danger", title: "Invalid", description: "Date is required." });
    if (new Date(`${form.availabilityDate}T${form.startTime}`) >= new Date(`${form.availabilityDate}T${form.endTime}`)) return addToast({ tone: "danger", title: "Invalid", description: "Start must be before end." });
    if (!(Number(form.slotDurationMinutes) > 0)) return addToast({ tone: "danger", title: "Invalid", description: "Slot duration must be > 0." });

    try {
      const res = await fetch(`/api/doctors/${doctorId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast({ tone: "danger", title: "Error", description: data?.error ?? "Failed to save availability." });
        return;
      }
      addToast({ tone: "success", title: "Saved", description: "Availability created." });
      setForm({ availabilityDate: "", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, appointmentMode: "in-person", notes: "" });
      loadAvailabilities(doctorId);
    } catch (err) {
      addToast({ tone: "danger", title: "Error", description: "Unexpected server error." });
    }
  }

  async function handleToggleActive(avId: string, currentlyActive: boolean) {
    if (!doctorId) return;
    try {
      const res = await fetch(`/api/doctors/${doctorId}/availability/${avId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast({ tone: "danger", title: "Error", description: data?.error ?? "Failed to update." });
        return;
      }
      addToast({ tone: "success", title: "Updated", description: "Availability updated." });
      loadAvailabilities(doctorId);
    } catch (err) {
      addToast({ tone: "danger", title: "Error", description: "Unexpected server error." });
    }
  }

  return (
    <Card>
      <CardHeader title="Availability management" description="Create date-specific availability blocks for patients to book." />
      <div className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input label="Date" type="date" value={form.availabilityDate} onChange={(e) => updateForm("availabilityDate", e.target.value)} />
          <Input label="Start time" type="time" value={form.startTime} onChange={(e) => updateForm("startTime", e.target.value)} />
          <Input label="End time" type="time" value={form.endTime} onChange={(e) => updateForm("endTime", e.target.value)} />
          <Input label="Slot duration (minutes)" type="number" value={String(form.slotDurationMinutes)} onChange={(e) => updateForm("slotDurationMinutes", Number(e.target.value))} />
          <Select label="Mode" value={form.appointmentMode} onChange={(v) => updateForm("appointmentMode", String(v))} options={[{ label: "In person", value: "in-person" }, { label: "Telehealth", value: "telehealth" }]} />
          <div />
          <Textarea label="Notes (optional)" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCreate}>Add availability</Button>
          <Button variant="ghost" onClick={() => loadAvailabilities(doctorId ?? undefined)}>Refresh</Button>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Upcoming availability</h4>
          {loading ? (
            <p className="text-sm text-[var(--color-ink-600)]">Loading…</p>
          ) : availabilities.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-600)]">No upcoming availability blocks.</p>
          ) : (
            <div className="grid gap-3">
              {availabilities.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <div className="text-sm font-medium">{a.availabilityDate}</div>
                    <div className="text-sm text-[var(--color-ink-700)]">{a.startTime} — {a.endTime} • {a.slotDurationMinutes}m • {a.appointmentMode}</div>
                    {a.notes ? <div className="text-xs text-[var(--color-ink-600)] mt-1">{a.notes}</div> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={a.isActive ? "ghost" : "secondary"} onClick={() => handleToggleActive(a.id, a.isActive)}>{a.isActive ? "Deactivate" : "Activate"}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
