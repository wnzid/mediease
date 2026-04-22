"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatBytes } from "@/lib/utils/format";

const STEP_TITLES = ["Personal", "Health basics", "Medical background", "Family history", "Documents & confirm"];

function ProgressStepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${i <= current ? "bg-[var(--color-brand-600)]" : "bg-[var(--color-panel-border)]"}`} />
            <span className="text-xs text-[var(--color-ink-600)] hidden md:inline">{s}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FileListItem({ item, onRemove }: { item: any; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[var(--color-panel-border)] bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[var(--color-panel-muted)] flex items-center justify-center">
          {item.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.previewUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <Icon name="file-text" className="w-6 h-6 text-[var(--color-brand-600)]" aria-hidden />
          )}
        </div>
        <div>
          <div className="text-sm font-medium text-[var(--color-ink-900)]">{item.name}</div>
          <div className="text-xs text-[var(--color-ink-600)]">{formatBytes(item.size)}{item.status === "uploaded" ? " • Uploaded" : item.status === "uploading" ? " • Uploading" : item.status === "error" ? ` • Error: ${item.errorMessage}` : ""}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {item.status === "uploaded" ? <span className="text-xs text-[var(--color-brand-600)]">Stored</span> : null}
        <Button variant="outline" size="sm" onClick={() => onRemove(item.id)}>Remove</Button>
      </div>
    </div>
  );
}

export function OnboardingForm() {
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mediease:onboarding:draft");
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mediease:onboarding:draft", JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  async function saveDraft(advance = false) {
    setSaving(true);
    try {
      await fetch("/api/patient/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (advance) setCurrent((c) => Math.min(STEP_TITLES.length - 1, c + 1));
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function submitFinal() {
    setSaving(true);
    try {
      await fetch("/api/patient/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      localStorage.removeItem("mediease:onboarding:draft");
      window.location.href = "/patient/dashboard";
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  const stepProps = { data, onChange: setData };

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader title="Medical profile" description="Complete your profile to improve care and safety." action={<ProgressStepper steps={STEP_TITLES} current={current} />} />

        <div className="mt-4">
          {current === 0 && <StepPersonal {...stepProps} />}
          {current === 1 && <StepHealthBasics {...stepProps} />}
          {current === 2 && <StepMedicalBackground {...stepProps} />}
          {current === 3 && <StepFamilyHistory {...stepProps} />}
          {current === 4 && <StepDocuments {...stepProps} />}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {current > 0 ? (
              <Button variant="outline" onClick={() => setCurrent((c) => Math.max(0, c - 1))}>Back</Button>
            ) : (
              <LinkButton href="/patient/dashboard" variant="ghost">Cancel</LinkButton>
            )}
            <Button variant="secondary" onClick={() => saveDraft(false)} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button variant="primary" onClick={() => saveDraft(true)} disabled={saving}>{saving ? "Saving..." : "Save & continue"}</Button>
          </div>

          <div className="flex items-center gap-3">
            {current < STEP_TITLES.length - 1 ? (
              <Button variant="primary" onClick={() => setCurrent((c) => Math.min(STEP_TITLES.length - 1, c + 1))}>Continue</Button>
            ) : (
              <Button variant="primary" onClick={() => submitFinal()} loading={saving}>Submit profile</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function StepPersonal({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--color-ink-600)]">Tell us a little about yourself - we’ll use this to help with appointments and safety.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Date of birth" name="date_of_birth" type="date" value={data.date_of_birth || ""} onChange={(e: any) => onChange({ ...data, date_of_birth: e.target.value })} />
        <Input label="Phone number" name="phone" type="tel" value={data.phone || ""} onChange={(e: any) => onChange({ ...data, phone: e.target.value })} />
      </div>

      <div className="grid gap-3">
        <Input label="Address" name="address" value={data.address || ""} onChange={(e: any) => onChange({ ...data, address: e.target.value })} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input label="Emergency contact name" name="emergency_contact_name" value={data.emergency_contact_name || ""} onChange={(e: any) => onChange({ ...data, emergency_contact_name: e.target.value })} />
        <Input label="Relationship" name="emergency_contact_relationship" value={data.emergency_contact_relationship || ""} onChange={(e: any) => onChange({ ...data, emergency_contact_relationship: e.target.value })} />
        <Input label="Emergency contact phone" name="emergency_contact_phone" value={data.emergency_contact_phone || ""} onChange={(e: any) => onChange({ ...data, emergency_contact_phone: e.target.value })} />
      </div>

      <div>
        <Input label="Insurance provider (optional)" name="insurance_provider" value={data.insurance_provider || ""} onChange={(e: any) => onChange({ ...data, insurance_provider: e.target.value })} />
      </div>
    </div>
  );
}

function StepHealthBasics({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--color-ink-600)]">Basic health information helps keep you safe during visits.</p>

      <div className="grid gap-3 md:grid-cols-3">
        <Input label="Height (cm)" name="height" value={data.height || ""} onChange={(e: any) => onChange({ ...data, height: e.target.value })} />
        <Input label="Weight (kg)" name="weight" value={data.weight || ""} onChange={(e: any) => onChange({ ...data, weight: e.target.value })} />
        <Input label="Blood type (optional)" name="blood_type" value={data.blood_type || ""} onChange={(e: any) => onChange({ ...data, blood_type: e.target.value })} />
      </div>

      <div className="grid gap-3">
        <label className="text-sm font-medium text-[var(--color-ink-800)]">Are you currently under medical care?</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => onChange({ ...data, under_medical_care: true })} className={data.under_medical_care ? "px-3 py-1 rounded-full bg-[var(--color-brand-600)] text-white" : "px-3 py-1 rounded-full border bg-white"}>Yes</button>
          <button type="button" onClick={() => onChange({ ...data, under_medical_care: false })} className={data.under_medical_care === false ? "px-3 py-1 rounded-full bg-[var(--color-brand-600)] text-white" : "px-3 py-1 rounded-full border bg-white"}>No</button>
        </div>
      </div>

      <div className="grid gap-3">
        <Input
          label="Chronic conditions (comma separated)"
          name="conditions"
          value={Array.isArray(data.conditions) ? data.conditions.join(", ") : (data.conditions ?? "")}
          onChange={(e: any) => onChange({ ...data, conditions: e.target.value })}
        />
        <Input
          label="Drug allergies (comma separated)"
          name="drug_allergies"
          value={Array.isArray(data.drug_allergies) ? data.drug_allergies.join(", ") : (data.drug_allergies ?? "")}
          onChange={(e: any) => onChange({ ...data, drug_allergies: e.target.value })}
        />
        <Input
          label="Environmental/food allergies (comma separated)"
          name="environmental_allergies"
          value={Array.isArray(data.environmental_allergies) ? data.environmental_allergies.join(", ") : (data.environmental_allergies ?? "")}
          onChange={(e: any) => onChange({ ...data, environmental_allergies: e.target.value })}
        />
        <Input
          label="Current medications (comma separated)"
          name="current_medications"
          value={Array.isArray(data.current_medications) ? data.current_medications.join(", ") : (data.current_medications ?? "")}
          onChange={(e: any) => onChange({ ...data, current_medications: e.target.value })}
        />
      </div>
    </div>
  );
}

function StepMedicalBackground({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--color-ink-600)]">Share important diagnoses, past surgeries, or other notes your care team should know.</p>

      <div className="grid gap-3">
        <Textarea label="Important diagnoses or conditions" name="diagnoses_or_conditions" value={data.diagnoses_or_conditions || ""} onChange={(e: any) => onChange({ ...data, diagnoses_or_conditions: e.target.value })} />
        <Textarea label="Past surgeries or hospitalizations" name="past_surgeries_or_hospitalizations" value={data.past_surgeries_or_hospitalizations || ""} onChange={(e: any) => onChange({ ...data, past_surgeries_or_hospitalizations: e.target.value })} />
        <Textarea label="Additional medical notes (optional)" name="additional_medical_notes" value={data.additional_medical_notes || ""} onChange={(e: any) => onChange({ ...data, additional_medical_notes: e.target.value })} />
      </div>
    </div>
  );
}

function StepFamilyHistory({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const families = data.family_history || { mother: "", father: "", siblings: "" };

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--color-ink-600)]">Optional: share major health conditions in close family members to help with risk assessments.</p>

      <div className="grid gap-3">
        <Input label="Mother - major health problems" name="mother_history" value={families.mother || ""} onChange={(e: any) => onChange({ ...data, family_history: { ...families, mother: e.target.value } })} />
        <Input label="Father - major health problems" name="father_history" value={families.father || ""} onChange={(e: any) => onChange({ ...data, family_history: { ...families, father: e.target.value } })} />
        <Input label="Siblings - major health problems" name="siblings_history" value={families.siblings || ""} onChange={(e: any) => onChange({ ...data, family_history: { ...families, siblings: e.target.value } })} />
      </div>
    </div>
  );
}

function StepDocuments({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [items, setItems] = useState<any[]>(() => {
    const existing = Array.isArray(data?.documents) ? data.documents : [];
    return existing.map((d: any, i: number) => ({
      id: `existing-${i}-${d.name}`,
      name: d.name,
      size: d.size ?? 0,
      key: d.key,
      status: d.key ? "uploaded" : "pending",
    }));
  });

  useEffect(() => {
    const serial = items.map((it) => ({ name: it.name, size: it.size, key: it.key, status: it.status }));
    onChange({ ...data, documents: serial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
      });
    };
  }, [items]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const supabase = createBrowserSupabaseClient();
    const arr = Array.from(fileList);

    const newItems: any[] = arr.map((file) => {
      const id = `f-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      return {
        id,
        file,
        name: file.name,
        size: file.size,
        mime: file.type,
        previewUrl,
        status: "pending",
      };
    });

    setItems((prev) => [...prev, ...newItems]);

    if (supabase) {
      for (const it of newItems) {
        if (it.size > MAX_FILE_SIZE) {
          it.status = "error";
          it.errorMessage = "File exceeds maximum size of 10MB";
          setItems((prev) => prev.map((p) => (p.id === it.id ? it : p)));
          continue;
        }

        try {
          it.status = "uploading";
          setItems((prev) => prev.map((p) => (p.id === it.id ? it : p)));

          const safeName = it.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `patient-documents/${Date.now()}-${safeName}`;
          const { data: upData, error } = await supabase.storage.from("patient-documents").upload(path, it.file as File, { cacheControl: "3600", upsert: false });
          if (error) {
            it.status = "error";
            it.errorMessage = error.message;
          } else {
            it.status = "uploaded";
            it.key = upData?.path;
          }
        } catch (e: any) {
          it.status = "error";
          it.errorMessage = e?.message ?? "Upload failed";
        }

        setItems((prev) => prev.map((p) => (p.id === it.id ? it : p)));
      }
    }
  }, [setItems, onChange, data]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) e.target.value = "";
  }, [handleFiles]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => setDragActive(false), []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="grid gap-4">
      <p className="text-sm text-[var(--color-ink-600)]">Upload reports, prescriptions, referrals, or diagnosis documents. Files are stored securely and attached to your profile.</p>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openFilePicker(); }}
        onClick={openFilePicker}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${dragActive ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)]" : "border-[var(--color-panel-border)] bg-white hover:bg-[var(--color-panel-muted)]"}`}
      >
        <input ref={inputRef} className="sr-only" type="file" multiple accept="application/pdf,image/*" onChange={onInputChange} />
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-[var(--color-panel-muted)] p-3">
              <Icon name="file-text" className="w-8 h-8 text-[var(--color-brand-600)]" aria-hidden />
            </div>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-[var(--color-ink-900)]">Upload medical documents</h3>
          <p className="mt-2 text-sm text-[var(--color-ink-600)]">Drag and drop files here, or click to browse</p>
          <p className="mt-1 text-sm text-[var(--color-ink-600)]">PDF, JPG, PNG accepted - Maximum file size: 10MB per file</p>
          <div className="mt-4 flex items-center justify-center">
            <Button variant="secondary" onClick={openFilePicker}>Click to browse</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {items.length > 0 ? (
          items.map((it) => (
            <FileListItem key={it.id} item={it} onRemove={removeItem} />
          ))
        ) : (
          <div className="rounded-md border border-[var(--color-panel-border)] bg-white p-4 text-sm text-[var(--color-ink-700)]">No documents uploaded yet.</div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--color-ink-600)]">Uploading is optional. You can continue without documents.</p>
        <LinkButton href="#" variant="outline">View upload guide</LinkButton>
      </div>
    </div>
  );
}
