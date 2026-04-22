"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import type { Doctor } from "@/types/doctors";
import { validateBooking, getStepErrors, isStepValid, type BookingFields } from "@/lib/validators/forms";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import Calendar from "@/components/ui/Calendar";
import { Input } from "@/components/ui/Input";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Textarea } from "@/components/ui/Textarea";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { useToast } from "@/components/providers/ToastProvider";
import { EmptyState } from "@/components/ui/EmptyState";

const steps = ["Choose doctor", "Visit type", "Date and time", "Reason", "Confirm"];

type BookingWizardProps = {
  initialDoctorId?: string;
  doctors: Doctor[];
  appointmentTypes: ReadonlyArray<{ label: string; value: string; description: string }>;
  appointmentModeOptions: ReadonlyArray<{ label: string; value: string; description: string }>;
  clinics?: ReadonlyArray<{ id: string; name: string; address?: string }>;
};

export function BookingWizard({ initialDoctorId, doctors, appointmentTypes, appointmentModeOptions, clinics }: BookingWizardProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BookingFields, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFields, boolean>>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [fields, setFields] = useState<BookingFields>({
    doctorId: initialDoctorId ?? "",
    appointmentType: "",
    mode: "",
    date: "",
    time: "",
    reason: "",
    guestFullName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<any | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const lastToastKey = useRef<string | null>(null);
  const [slots, setSlots] = useState<Array<{ startAt: string; endAt: string; label: string; isAvailable: boolean; appointmentId?: string | null; availabilityId?: string | null }>>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [availabilitySummary, setAvailabilitySummary] = useState<Record<string, { status: "available" | "fullyBooked" | "unavailable"; totalSlots: number; availableSlots: number }> | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const selectedDoctor = useMemo(() => doctors.find((doctor) => doctor.id === fields.doctorId), [doctors, fields.doctorId]);
  const selectedClinic = useMemo(() => {
    const clinicId = selectedDoctor?.clinicIds?.[0];
    return (clinics ?? []).find((clinic) => clinic.id === clinicId) ?? null;
  }, [selectedDoctor, clinics]);
  // Fetch available slots whenever doctor or date changes
  useEffect(() => {
    async function loadSlots() {
      setSlots([]);
      setSlotsError(null);
      setSlotsLoading(true);
      updateField("time", "");

      if (!fields.doctorId || !fields.date) {
        setSlotsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/doctors/${fields.doctorId}/available-slots?date=${encodeURIComponent(fields.date)}`);
        const data = await res.json();
        if (!res.ok) {
          setSlotsError(data?.error ?? "Failed to load slots");
        } else {
          const newSlots = (data?.slots ?? []) as any;
          setSlots(newSlots);
          // Auto-select first available slot if none already selected
          if (!fields.time) {
            const firstAvailable = newSlots.find((s: any) => s.isAvailable);
            if (firstAvailable) {
              updateField("time", new Date(firstAvailable.startAt).toISOString());
            }
          }

          // If this date has no available slots, try to find the next nearest date with available slots
          const anyAvailable = newSlots.some((s: any) => s.isAvailable);
          if (!anyAvailable && availabilitySummary) {
            const dates = Object.keys(availabilitySummary).sort();
            const currentIndex = dates.indexOf(fields.date);
            const forward = currentIndex >= 0 ? dates.slice(currentIndex + 1) : dates;
            const next = forward.find((d) => (availabilitySummary[d]?.availableSlots ?? 0) > 0);
            if (next && next !== fields.date) {
              // switch to next available date and let the effect re-run to load its slots
              updateField("date", next as any);
              // skip showing the empty message for this date
              setSlots([]);
              setSlotsLoading(true);
              return;
            }
          }
        }
      } catch (err) {
        setSlotsError("Network error");
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.doctorId, fields.date]);

  // When doctor changes, reset date/time and fetch availability summary (next 30 days)
  useEffect(() => {
    async function loadSummary() {
      setAvailabilitySummary(null);
      setSummaryError(null);
      setSummaryLoading(true);
      updateField("date", "");
      updateField("time", "");

      if (!fields.doctorId) {
        setSummaryLoading(false);
        return;
      }

      const start = new Date().toISOString().slice(0, 10);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const end = endDate.toISOString().slice(0, 10);

      try {
        const res = await fetch(`/api/doctors/${fields.doctorId}/availability-summary?start=${start}&end=${end}`);
        const data = await res.json();
        if (!res.ok) {
          setSummaryError(data?.error ?? "Failed to load availability");
          setSummaryLoading(false);
          return;
        }

        const map: Record<string, any> = {};
        (data.summary ?? []).forEach((s: any) => {
          map[s.date] = s;
        });
        setAvailabilitySummary(map);

        // pick nearest available date
        const nearest = (data.summary ?? []).find((s: any) => s.status === "available");
        if (nearest) {
          updateField("date", nearest.date);
        }
      } catch (err) {
        setSummaryError("Network error");
      } finally {
        setSummaryLoading(false);
      }
    }

    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.doctorId]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
          setIsAuthenticated(false);
          return;
        }
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(Boolean(data?.user));
      } catch (e) {
        setIsAuthenticated(false);
      }
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateField<K extends keyof BookingFields>(key: K, value: BookingFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  function scrollToFirstInvalidField(keys: (keyof BookingFields)[]) {
    if (typeof window === "undefined") return;
    const map: Record<string, string> = {
      doctorId: "doctorId",
      appointmentType: "appointmentType",
      mode: "mode",
      date: "date",
      time: "time",
      reason: "reason",
      guestFullName: "guestFullName",
      guestEmail: "guestEmail",
      guestPhone: "guestPhone",
    };

    const first = keys[0] as string;
    const id = map[first] ?? null;
    if (!id) return;

    // Wait a tick for DOM to update
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.querySelector("input,textarea,button,select,[tabindex]") as HTMLElement | null;
        if (focusable) focusable.focus();
      }
    }, 60);
  }

  const currentStepErrors = useMemo(() => getStepErrors(currentStep, fields), [currentStep, fields]);

  const isFinalValid = useMemo(() => Object.keys(validateBooking(fields)).length === 0, [fields]);
  const isCurrentStepValid = currentStep === 5 ? isFinalValid : isStepValid(currentStep, fields);

  function visibleError(key: keyof BookingFields) {
    // fieldErrors takes precedence (server or previously set errors)
    if (fieldErrors[key]) return fieldErrors[key];
    if ((touched[key] || showAllErrors) && currentStepErrors[key]) return currentStepErrors[key];
    return undefined;
  }

  async function checkEmailExists(email?: string) {
    const addr = String(email ?? fields.guestEmail ?? "").trim();
    if (!addr) {
      setEmailExists(null);
      setShowEmailPrompt(false);
      return;
    }
    // Basic client-side format check to avoid noisy requests
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
      setEmailExists(null);
      setShowEmailPrompt(false);
      return;
    }

    setCheckingEmail(true);
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr }),
      });
      const data = await res.json();
      const exists = Boolean(data?.exists);
      setEmailExists(exists);
      // Only show the inline sign-in prompt to unauthenticated visitors
      if (exists) {
        if (isAuthenticated === null) {
          try {
            const supabase = createBrowserSupabaseClient();
            if (supabase) {
              const { data: userData } = await supabase.auth.getUser();
              const logged = Boolean(userData?.user);
              setIsAuthenticated(logged);
              setShowEmailPrompt(!logged);
            } else {
              setIsAuthenticated(false);
              setShowEmailPrompt(true);
            }
          } catch (e) {
            setIsAuthenticated(false);
            setShowEmailPrompt(true);
          }
        } else {
          setShowEmailPrompt(!isAuthenticated);
        }
      } else {
        setShowEmailPrompt(false);
      }
    } catch (err) {
      setEmailExists(null);
      setShowEmailPrompt(false);
    } finally {
      setCheckingEmail(false);
    }
  }

  async function goNext() {
    if (submittingRef.current) return;
    // Validate current step before advancing or submitting
    const stepErrors = getStepErrors(currentStep, fields);
    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...stepErrors }));
      setTouched((t) => {
        const copy = { ...(t ?? {}) } as Partial<Record<keyof BookingFields, boolean>>;
        Object.keys(stepErrors).forEach((k) => {
          copy[k as keyof BookingFields] = true;
        });
        return copy;
      });
      setShowAllErrors(true);
      // Scroll to first invalid field so user can correct it
      scrollToFirstInvalidField(Object.keys(stepErrors) as (keyof BookingFields)[]);
      return;
    }

    // If we're on the final step and validation passed, submit
    if (currentStep === 5) {
      // Prevent re-entrancy and mark submitting immediately
      submittingRef.current = true;
      setSubmitting(true);
      try {
        // fields.time stores the ISO start timestamp for the selected slot
        const startIso = new Date(fields.time).toISOString();
        const selectedSlot = slots.find((s) => new Date(s.startAt).toISOString() === startIso);
        const endIso = selectedSlot?.endAt ?? new Date(new Date(startIso).getTime() + 30 * 60 * 1000).toISOString();

        const payload = {
          doctorId: fields.doctorId,
          date: fields.date,
          clinicId: selectedClinic?.id ?? null,
          appointmentType: fields.appointmentType,
          mode: fields.mode,
          reason: fields.reason,
          startsAt: startIso,
          endsAt: endIso,
          guestFullName: fields.guestFullName,
          guestEmail: fields.guestEmail,
          guestPhone: fields.guestPhone,
        };

        const res = await fetch("/api/appointments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || data?.error) {
          const msg = data?.error ?? "Unable to create appointment.";
          const key = `danger|Booking failed|${msg}`;
          if (lastToastKey.current !== key) {
            addToast({ tone: "danger", title: "Booking failed", description: msg });
            lastToastKey.current = key;
            window.setTimeout(() => (lastToastKey.current = null), 5000);
          }
          return;
        }

        addToast({ tone: "success", title: "Appointment booked", description: "Your appointment request was submitted." });
        // Use appointment summary returned from API to show confirmation modal
        if (data?.appointment) {
          setBookingSummary(data.appointment);
          setShowConfirmation(true);
        } else {
          setBookingComplete(true);
        }
      } catch (err) {
        const msg = "Unexpected server error.";
        const key = `danger|Booking failed|${msg}`;
        if (lastToastKey.current !== key) {
          addToast({ tone: "danger", title: "Booking failed", description: msg });
          lastToastKey.current = key;
          window.setTimeout(() => (lastToastKey.current = null), 5000);
        }
      } finally {
        setSubmitting(false);
        submittingRef.current = false;
      }

      return;
    }

    setCurrentStep((step) => Math.min(step + 1, 5));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid gap-6">
        <ProgressSteps currentStep={currentStep} steps={steps} />
        <Card>
          <CardHeader
            title={steps[currentStep - 1]}
            description="Move through the booking flow with clear choices and visible context."
          />

          {currentStep === 1 ? (
            <div className="grid gap-5">
              {doctors && doctors.length > 0 ? (
                <div id="doctorId" className="grid gap-5 sm:grid-cols-2">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => {
                        updateField("doctorId", doctor.id);
                        setTouched((t) => ({ ...(t ?? {}), doctorId: true }));
                        setShowAllErrors(false);
                      }}
                      className={
                        fields.doctorId === doctor.id ? "rounded-[var(--radius-panel)] ring-2 ring-[var(--color-brand-400)]" : ""
                      }
                    >
                      <DoctorCard doctor={doctor} compact showLinks={false} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="min-h-[12rem] flex items-center justify-center">
                  <EmptyState
                    icon="search"
                    title="No doctors are available yet."
                    description="Please check back later or contact the clinic."
                  />
                </div>
              )}
              {visibleError("doctorId") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("doctorId")}</p> : null}
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="grid gap-6">
              <div id="appointmentType">
                <RadioGroup
                  label="Appointment type"
                  name="appointmentType"
                  value={fields.appointmentType}
                  onChange={(value) => {
                    updateField("appointmentType", value as BookingFields["appointmentType"]);
                    setTouched((t) => ({ ...(t ?? {}), appointmentType: true }));
                    setShowAllErrors(false);
                  }}
                  options={appointmentTypes}
                  columns={2}
                  error={visibleError("appointmentType")}
                />
              </div>
              <div id="mode">
                <RadioGroup
                  label="Visit mode"
                  name="mode"
                  value={fields.mode}
                  onChange={(value) => {
                    updateField("mode", value as BookingFields["mode"]);
                    setTouched((t) => ({ ...(t ?? {}), mode: true }));
                    setShowAllErrors(false);
                  }}
                  options={appointmentModeOptions}
                  columns={2}
                  error={visibleError("mode")}
                />
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[var(--color-ink-800)]">Preferred date</label>
                <div id="date" className="mt-2">
                  {summaryLoading ? (
                    <div className="text-sm text-[var(--color-ink-600)]">Loading calendar…</div>
                  ) : summaryError ? (
                    <div className="text-sm text-[var(--color-danger-700)]">{summaryError}</div>
                  ) : (
                    <Calendar
                      selectedDate={fields.date || null}
                      onSelect={(d) => {
                        updateField("date", d);
                        setTouched((t) => ({ ...(t ?? {}), date: true }));
                        setShowAllErrors(false);
                      }}
                      availabilitySummary={availabilitySummary}
                      minDate={new Date().toISOString().slice(0, 10)}
                      initialMonth={fields.date ? fields.date.slice(0, 7) : undefined}
                    />
                  )}
                </div>
              {visibleError("date") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("date")}</p> : null}
              </div>
              <div id="time" className="grid gap-3">
                <p className="text-sm font-medium text-[var(--color-ink-800)]">Available times</p>
                  <div className="grid grid-cols-2 gap-3">
                    {slotsLoading ? (
                      <div className="col-span-2 p-4 text-sm text-[var(--color-ink-600)]">Loading available times…</div>
                    ) : slotsError ? (
                      <div className="col-span-2 p-4 text-sm text-[var(--color-danger-700)]">{slotsError}</div>
                    ) : slots.length === 0 ? (
                      <div className="col-span-2 p-4 text-sm text-[var(--color-ink-600)]">
                        {availabilitySummary && availabilitySummary[fields.date] ? (
                          availabilitySummary[fields.date].status === "fullyBooked" ? (
                            "This date is fully booked. Try another day."
                          ) : (
                            "This doctor has no availability on this date."
                          )
                        ) : (
                          "No available times for this date."
                        )}
                      </div>
                    ) : (
                      slots.map((slot) => {
                        const isSelected = fields.time && new Date(fields.time).toISOString() === new Date(slot.startAt).toISOString();
                        return (
                          <button
                            key={slot.startAt}
                            type="button"
                            onClick={() => {
                              if (!slot.isAvailable) return;
                              updateField("time", new Date(slot.startAt).toISOString());
                              setTouched((t) => ({ ...(t ?? {}), time: true }));
                              setShowAllErrors(false);
                            }}
                            disabled={!slot.isAvailable}
                            className={`h-11 rounded-full border px-4 text-sm font-medium transition ${
                              isSelected
                                ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                                : slot.isAvailable
                                ? "border-[var(--color-panel-border)] bg-white text-[var(--color-ink-700)]"
                                : "border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] text-[var(--color-ink-400)]"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })
                    )}
                  </div>
                {visibleError("time") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("time")}</p> : null}
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <Textarea
              id="reason"
              label="Reason for visit"
              value={fields.reason}
              onChange={(event) => {
                updateField("reason", event.target.value);
                setTouched((t) => ({ ...(t ?? {}), reason: true }));
                setShowAllErrors(false);
              }}
              hint="Share what you want the clinician to know before the visit."
              error={visibleError("reason")}
            />
          ) : null}

          {currentStep === 5 ? (
            <div className="grid gap-4 rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-[var(--color-surface-muted)] p-5">
              <p className="text-sm text-[var(--color-ink-600)]">Review your booking summary before confirming.</p>
              <p className="text-lg font-semibold text-[var(--color-ink-950)]">{selectedDoctor?.fullName}</p>
              <p className="text-sm text-[var(--color-ink-700)]">
                {fields.appointmentType} / {fields.mode}
              </p>
              {visibleError("appointmentType") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("appointmentType")}</p> : null}
              {visibleError("mode") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("mode")}</p> : null}
              <p className="text-sm text-[var(--color-ink-700)]">
                {fields.date || "Date not selected"} at {fields.time ? new Date(fields.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "time not selected"}
              </p>
              {visibleError("date") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("date")}</p> : null}
              {visibleError("time") ? <p className="text-xs font-semibold text-[var(--color-danger-700)]">{visibleError("time")}</p> : null}
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">{fields.reason || "No visit reason provided yet."}</p>

              <div className="mt-4 grid gap-3">
                <Input
                  id="guestFullName"
                  label="Full name"
                  value={fields.guestFullName as string}
                  onChange={(e) => {
                    updateField("guestFullName", e.target.value as any);
                    setTouched((t) => ({ ...(t ?? {}), guestFullName: true }));
                    setShowAllErrors(false);
                  }}
                  error={visibleError("guestFullName")}
                />

                <Input
                  id="guestEmail"
                  label="Email"
                  type="email"
                  value={fields.guestEmail as string}
                  onChange={(e) => {
                    updateField("guestEmail", e.target.value as any);
                    setTouched((t) => ({ ...(t ?? {}), guestEmail: true }));
                    setShowAllErrors(false);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...(t ?? {}), guestEmail: true }));
                    checkEmailExists();
                  }}
                  error={visibleError("guestEmail")}
                />

                <Input
                  id="guestPhone"
                  label="Phone (optional)"
                  type="tel"
                  value={fields.guestPhone as string}
                  onChange={(e) => {
                    updateField("guestPhone", e.target.value as any);
                    setTouched((t) => ({ ...(t ?? {}), guestPhone: true }));
                    setShowAllErrors(false);
                  }}
                  error={visibleError("guestPhone")}
                />

                {showEmailPrompt && emailExists && !isAuthenticated ? (
                  <div className="rounded-[var(--radius-control)] border border-[var(--color-panel-border)] bg-[var(--color-surface)] p-3">
                    <p className="text-sm font-medium text-[var(--color-ink-900)]">This email already has an account. Would you like to sign in?</p>
                    <p className="text-sm text-[var(--color-ink-700)] mt-1">Sign in to use your saved details and manage this appointment from your dashboard.</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/auth/sign-in?email=${encodeURIComponent(String(fields.guestEmail || ""))}&next=${encodeURIComponent(
                              typeof window !== "undefined" ? window.location.pathname + window.location.search : "/",
                            )}`,
                          )
                        }
                      >
                        Sign in
                      </Button>
                      <Button size="sm" onClick={() => setShowEmailPrompt(false)}>Continue without signing in</Button>
                    </div>
                    <p className="text-xs mt-2 text-[var(--color-ink-600)]">You can still complete your booking without signing in.</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <Modal
            open={showConfirmation}
            onClose={() => {
              setShowConfirmation(false);
              setBookingSummary(null);
            }}
            title={"Booking confirmed"}
            description={"Your appointment request was submitted."}
          >
            <div className="grid gap-4">
              <div className="grid gap-1">
                <p className="text-sm text-[var(--color-ink-700)]">Booking successful</p>
                <p className="text-lg font-semibold text-[var(--color-ink-950)]">{bookingSummary?.doctor?.fullName ?? selectedDoctor?.fullName}</p>
              </div>

              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Booking reference</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.reference ?? "Unavailable"}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Patient</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.patient?.fullName ?? fields.guestFullName}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Service</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{appointmentTypes.find((t) => t.value === (bookingSummary?.appointmentType ?? fields.appointmentType))?.label ?? (bookingSummary?.appointmentType ?? fields.appointmentType)}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Date</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.startsAt ? new Date(bookingSummary.startsAt).toLocaleDateString() : fields.date}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Time</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.startsAt ? new Date(bookingSummary.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (fields.time ? new Date(fields.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Mode</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.mode ?? fields.mode}</dd>
                </div>
                {bookingSummary?.clinic?.name || selectedClinic ? (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-xs text-[var(--color-ink-600)]">Location</dt>
                    <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.clinic?.name ?? selectedClinic?.name}</dd>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-2">
                  <dt className="text-xs text-[var(--color-ink-600)]">Email</dt>
                  <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.patient?.email ?? fields.guestEmail}</dd>
                </div>
                {bookingSummary?.patient?.phone || fields.guestPhone ? (
                  <div className="grid grid-cols-2 gap-2">
                    <dt className="text-xs text-[var(--color-ink-600)]">Phone</dt>
                    <dd className="font-medium text-[var(--color-ink-900)]">{bookingSummary?.patient?.phone ?? fields.guestPhone}</dd>
                  </div>
                ) : null}
              </dl>

              <p className="text-xs text-[var(--color-ink-600)]">If you sign in later with this email, this appointment will appear in your dashboard.</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => { setShowConfirmation(false); setBookingSummary(null); router.push("/patient/appointments"); }}>Done</Button>
                <Button size="sm" onClick={() => { setShowConfirmation(false); setBookingSummary(null); router.push("/book"); }}>Book another appointment</Button>
                {bookingSummary?.patient?.email ? (
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/auth/sign-in?email=${encodeURIComponent(String(bookingSummary.patient.email))}&next=${encodeURIComponent("/patient/appointments")}`)}>Sign in</Button>
                ) : null}
              </div>
            </div>
          </Modal>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={goBack} disabled={currentStep === 1 || submitting}>
              Back
            </Button>
            <Button
              size="sm"
              onClick={goNext}
              disabled={submitting || !isCurrentStepValid}
              loading={submitting}
            >
              {currentStep === 5 ? (submitting ? "Booking..." : "Confirm booking") : "Continue"}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-[calc(var(--layout-header-height)+1.25rem)]">
        <CardHeader title="Booking summary" description="Key details stay visible as you move through the flow." />
        {selectedDoctor ? (
          <DoctorCard
            doctor={selectedDoctor}
            compact
            showLinks={false}
            primaryClinicName={selectedClinic?.name ?? null}
          />
        ) : (
          <p className="text-sm text-[var(--color-ink-600)]">Choose a doctor to begin.</p>
        )}
        {selectedClinic ? (
          <div className="mt-4 rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] p-4 text-sm leading-6 text-[var(--color-ink-700)]">
            <p className="font-semibold text-[var(--color-ink-900)]">{selectedClinic.name}</p>
            <p>{selectedClinic.address}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
