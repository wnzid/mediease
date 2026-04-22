import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import type { Clinic } from "@/types/clinics";
import type { Doctor, AvailabilitySlot, DoctorAvailability } from "@/types/doctors";
import type { Appointment, Notification } from "@/types/appointments";

export const appointmentTypes = [
  {
    label: "New patient visit",
    value: "new-patient",
    description: "For your first appointment or a new specialist relationship.",
  },
  {
    label: "Follow-up",
    value: "follow-up",
    description: "For medication reviews, progress checks, and next-step planning.",
  },
  {
    label: "Urgent concern",
    value: "urgent",
    description: "For time-sensitive symptoms that still fit outpatient care.",
  },
  {
    label: "Wellness",
    value: "wellness",
    description: "For preventive visits, screenings, and general health planning.",
  },
] as const;

export const appointmentModeOptions = [
  {
    label: "In person",
    value: "in-person",
    description: "Visit the clinic and check in at the front desk.",
  },
  {
    label: "Telehealth",
    value: "telehealth",
    description: "Join securely from home with captions-ready video.",
  },
] as const;

async function clientOrEmpty<T>(fn: () => Promise<T>) {
  if (!isSupabaseConfigured()) return null;
  try {
    return await fn();
  } catch {
    return null;
  }
}

function slugify(value: string): string {
  return (
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export async function getClinics(): Promise<Clinic[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Clinic[];

    const { data: rows } = await supabase.from("clinics").select("id, name, email, location, created_at, updated_at").order("name");
    const mapped = (rows ?? []).map((row: any) => ({
      id: row.id,
      name: row.name ?? "",
      slug: slugify(row.name ?? String(row.id)),
      city: row.location ?? "",
      state: "Lithuania",
      address: row.location ?? "",
      phone: "",
      email: row.email ?? "",
      accessibilityFeatures: [],
      services: [],
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
    })) as Clinic[];

    return mapped;
  });

  return data ?? [];
}

export async function getClinicById(id: string): Promise<Clinic | null> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data: row } = await supabase.from("clinics").select("id, name, email, location, created_at, updated_at").eq("id", id).maybeSingle();
    if (!row) return null;
    const mapped: Clinic = {
      id: row.id,
      name: row.name ?? "",
      slug: slugify(row.name ?? String(row.id)),
      city: row.location ?? "",
      state: "Lithuania",
      address: row.location ?? "",
      phone: "",
      email: row.email ?? "",
      accessibilityFeatures: [],
      services: [],
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
    };
    return mapped;
  });

  return data ?? null;
}

export async function getDoctors(): Promise<Doctor[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Doctor[];

    // Fetch profiles with role = 'doctor'
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, created_at, updated_at")
      .eq("role", "doctor");

    // Fetch doctor profile details
    const { data: doctorProfiles } = await supabase.from("doctor_profiles").select("id, specialty, clinic_id, created_at, updated_at");

    const profs = (profiles ?? []) as any[];
    const docProfiles = (doctorProfiles ?? []) as any[];

    const mapped = profs.map((p) => {
      const dp = docProfiles.find((d) => d.id === p.id) ?? null;
      const clinicId = dp?.clinic_id ?? null;

      return {
        id: p.id,
        profileId: p.id,
        slug: slugify(p.full_name ?? p.email ?? p.id),
        fullName: p.full_name ?? p.email ?? p.id,
        specialty: dp?.specialty ?? "General Medicine",
        subSpecialty: undefined,
        yearsExperience: 0,
        languages: ["English"],
        clinicIds: clinicId ? [clinicId] : [],
        rating: 0,
        reviewCount: 0,
        acceptsTelehealth: true,
        acceptsNewPatients: true,
        insuranceAccepted: [],
        bio: "Profile details will be added soon.",
        careApproach: "",
        education: [],
        avatarUrl: null,
        createdAt: p.created_at ?? null,
        updatedAt: p.updated_at ?? null,
      } as Doctor;
    });

    return mapped;
  });

  return data ?? [];
}

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const docs = await getDoctors();
  return docs.find((d) => d.slug === slug) ?? null;
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
  const docs = await getDoctors();
  return docs.find((d) => d.id === id) ?? null;
}

export async function getAppointmentsForDoctor(doctorId: string): Promise<Appointment[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Appointment[];
    const { data } = await supabase.from("appointments").select("*").eq("doctor_id", doctorId).order("starts_at", { ascending: false });
    return (data ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  });

  return data ?? [];
}

export async function getAppointmentsForPatient(profileId: string): Promise<Appointment[]> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return [] as Appointment[];
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", profileId)
      .order("starts_at", { ascending: false });

    if (error) {
      return [] as Appointment[];
    }

    const rows = (data ?? []).map(mapAppointmentRowToCamel) as Appointment[];
    return rows;
  } catch (err) {
    // unexpected error - return empty
    return [] as Appointment[];
  }
}

// Temporary debug helper: query appointments using service-role client to compare results (for RLS debugging)
export async function getAppointmentsForPatientService(profileId: string): Promise<Appointment[]> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) {
      return [] as Appointment[];
    }

    const { data, error } = await service
      .from("appointments")
      .select("*")
      .eq("patient_id", profileId)
      .order("starts_at", { ascending: false });

    if (error) {
      return [] as Appointment[];
    }

    const rows = (data ?? []).map(mapAppointmentRowToCamel) as Appointment[];
    return rows;
  } catch (err) {
    // unexpected error - return empty
    return [] as Appointment[];
  }
}

// Dedicated helper for the patient appointments page. Uses the service-role client
// to return all appointments for a given profile id (includes pending, confirmed, etc.).
export async function getAppointmentsForPatientByProfileId(profileId: string): Promise<Appointment[]> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) return [] as Appointment[];

    const { data, error } = await service
      .from("appointments")
      .select("*")
      .eq("patient_id", profileId)
      .order("starts_at", { ascending: false });

    if (error) {
      return [] as Appointment[];
    }

    return (data ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  } catch (err) {
    // unexpected error - return empty
    return [] as Appointment[];
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
    return (data ?? null) as Appointment | null;
  });

  return data ?? null;
}

export async function getNotificationsForProfile(profileId: string): Promise<Notification[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Notification[];
    const { data } = await supabase.from("notifications").select("*").eq("profile_id", profileId).order("created_at", { ascending: false });
    return (data ?? []) as Notification[];
  });

  return data ?? [];
}

export async function getProfiles(): Promise<any[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as any[];
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    return (data ?? []) as any[];
  });

  return data ?? [];
}

export async function getAppointmentStatusCounts(): Promise<Record<string, number>> {
  const result = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as any[];
    const { data } = await supabase.from("appointments").select("status");
    return (data ?? []) as any[];
  });

  const rows = result ?? [];
  const counts: Record<string, number> = {};
  rows.forEach((r: any) => {
    const s = r?.status ?? "unknown";
    counts[s] = (counts[s] ?? 0) + 1;
  });

  return counts;
}

// --- Availability & slot helpers ---

function mapAppointmentRowToCamel(row: any): Appointment {
  return {
    id: row.id,
    reference: row.reference ?? null,
    patientId: row.patient_id,
    doctorId: row.doctor_id,
    clinicId: row.clinic_id,
    availabilityId: row.availability_id ?? null,
    bookedByProfileId: row.booked_by_profile_id ?? null,
    status: row.status,
    appointmentType: row.appointment_type,
    mode: row.mode,
    reason: row.reason ?? null,
    notes: row.notes ?? null,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    cancelledAt: row.cancelled_at ?? null,
    cancelledBy: row.cancelled_by ?? null,
    cancellationReason: row.cancellation_reason ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  } as Appointment;
}

export async function getDoctorAvailability(doctorId: string, fromDate?: string, toDate?: string): Promise<DoctorAvailability[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as DoctorAvailability[];

    let query = supabase.from("doctor_availability").select("*").eq("doctor_id", doctorId).order("availability_date", { ascending: true });

    if (fromDate) query = query.gte("availability_date", fromDate);
    if (toDate) query = query.lte("availability_date", toDate);

    const { data: rows } = await query;
    const mapped = (rows ?? []).map((r: any) => ({
      id: r.id,
      doctorId: r.doctor_id,
      availabilityDate: r.availability_date,
      startTime: r.start_time,
      endTime: r.end_time,
      slotDurationMinutes: r.slot_duration_minutes,
      appointmentMode: r.appointment_mode,
      isActive: Boolean(r.is_active),
      notes: r.notes ?? null,
      createdAt: r.created_at ?? null,
      updatedAt: r.updated_at ?? null,
    })) as DoctorAvailability[];

    return mapped;
  });

  return data ?? [];
}
 

export async function getBookedAppointmentsForDoctorAndDate(doctorId: string, date: string): Promise<Appointment[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Appointment[];

    const dayStart = new Date(`${date}T00:00:00`).toISOString();
    const dayEnd = new Date(`${date}T23:59:59`).toISOString();

    const { data: rows } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .in("status", ["pending", "confirmed"])
      .order("starts_at", { ascending: true });

    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  });

  return data ?? [];
}

export async function getBookedAppointmentsForDoctorBetweenDates(doctorId: string, fromDate: string, toDate: string): Promise<Appointment[]> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [] as Appointment[];

    const dayStart = new Date(`${fromDate}T00:00:00`).toISOString();
    const dayEnd = new Date(`${toDate}T23:59:59`).toISOString();

    const { data: rows } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .in("status", ["pending", "confirmed"])
      .order("starts_at", { ascending: true });

    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  });

  return data ?? [];
}

// --- Service-role helpers (use only on server routes that need elevated read access) ---
export async function getDoctorAvailabilityService(doctorId: string, fromDate?: string, toDate?: string): Promise<DoctorAvailability[]> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) return [] as DoctorAvailability[];

    let query: any = service.from("doctor_availability").select("*").eq("doctor_id", doctorId).order("availability_date", { ascending: true });
    if (fromDate) query = query.gte("availability_date", fromDate);
    if (toDate) query = query.lte("availability_date", toDate);

    const { data: rows, error } = await query;
    if (error) throw error;

    return (rows ?? []).map((r: any) => ({
      id: r.id,
      doctorId: r.doctor_id,
      availabilityDate: r.availability_date,
      startTime: r.start_time,
      endTime: r.end_time,
      slotDurationMinutes: r.slot_duration_minutes,
      appointmentMode: r.appointment_mode,
      isActive: Boolean(r.is_active),
      notes: r.notes ?? null,
      createdAt: r.created_at ?? null,
      updatedAt: r.updated_at ?? null,
    })) as DoctorAvailability[];
  } catch (err) {
    // bubble error to caller to allow route-level logging
    throw err;
  }
}

export async function getAvailabilityByDoctorAndDateService(doctorId: string, date: string): Promise<DoctorAvailability | null> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) return null;
    const { data: row, error } = await service
      .from("doctor_availability")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("availability_date", date)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    return {
      id: row.id,
      doctorId: row.doctor_id,
      availabilityDate: row.availability_date,
      startTime: row.start_time,
      endTime: row.end_time,
      slotDurationMinutes: row.slot_duration_minutes,
      appointmentMode: row.appointment_mode,
      isActive: Boolean(row.is_active),
      notes: row.notes ?? null,
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
    };
  } catch (err) {
    throw err;
  }
}

export async function getAvailabilityByDoctorAndDate(
  doctorId: string,
  date: string
): Promise<DoctorAvailability | null> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;

    const { data: row } = await supabase
      .from("doctor_availability")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("availability_date", date)
      .maybeSingle();

    if (!row) return null;

    const mapped: DoctorAvailability = {
      id: row.id,
      doctorId: row.doctor_id,
      availabilityDate: row.availability_date,
      startTime: row.start_time,
      endTime: row.end_time,
      slotDurationMinutes: row.slot_duration_minutes,
      appointmentMode: row.appointment_mode,
      isActive: Boolean(row.is_active),
      notes: row.notes ?? null,
      createdAt: row.created_at ?? null,
      updatedAt: row.updated_at ?? null,
    };

    return mapped;
  });

  return data ?? null;
}

export async function getBookedAppointmentsForDoctorAndDateService(doctorId: string, date: string): Promise<Appointment[]> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) return [] as Appointment[];

    const dayStart = new Date(`${date}T00:00:00`).toISOString();
    const dayEnd = new Date(`${date}T23:59:59`).toISOString();

    const { data: rows, error } = await service
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .in("status", ["pending", "confirmed"])
      .order("starts_at", { ascending: true });

    if (error) throw error;
    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  } catch (err) {
    throw err;
  }
}

export async function getBookedAppointmentsForDoctorBetweenDatesService(doctorId: string, fromDate: string, toDate: string): Promise<Appointment[]> {
  try {
    const service = createServiceSupabaseClient();
    if (!service) return [] as Appointment[];

    const dayStart = new Date(`${fromDate}T00:00:00`).toISOString();
    const dayEnd = new Date(`${toDate}T23:59:59`).toISOString();

    const { data: rows, error } = await service
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .gte("starts_at", dayStart)
      .lte("starts_at", dayEnd)
      .in("status", ["pending", "confirmed"])
      .order("starts_at", { ascending: true });

    if (error) throw error;
    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  } catch (err) {
    throw err;
  }
}

export async function getUpcomingAppointmentForPatient(profileId: string): Promise<Appointment | null> {
  const data = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const now = new Date().toISOString();
    const { data: row } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", profileId)
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!row) return null;
    return mapAppointmentRowToCamel(row);
  });

  return data ?? null;
}

// Resolve a profile id by email (case-insensitive, trimmed). Tries server client first, then service-role client as fallback.
export async function resolveProfileIdByEmail(email: string): Promise<string | null> {
  const userEmail = String(email ?? "").trim().toLowerCase();
  if (!userEmail) return null;

  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase.from("profiles").select("id").ilike("email", userEmail).maybeSingle();
      if (data?.id) return data.id;
    }
  } catch (err) {
    // fall through to service lookup
  }

  try {
    const svc = createServiceSupabaseClient();
    if (svc) {
      const { data } = await svc.from("profiles").select("id").ilike("email", userEmail).maybeSingle();
      if (data?.id) return data.id;
    }
  } catch (err) {}

  return null;
}

// Convenience: fetch all appointments for a patient identified by email
export async function getAppointmentsForPatientByEmail(email: string): Promise<Appointment[]> {
  const id = await resolveProfileIdByEmail(email);
  if (!id) return [] as Appointment[];
  return await getAppointmentsForPatientByProfileId(id);
}

// Convenience: fetch nearest upcoming appointment for a patient identified by email
export async function getUpcomingAppointmentForPatientByEmail(email: string): Promise<Appointment | null> {
  const id = await resolveProfileIdByEmail(email);
  if (!id) return null;
  return await getUpcomingAppointmentForPatient(id);
}

// Compute next upcoming appointment using the same client-side rules used in the Appointments page.
// This resolves profile id, fetches all appointments for the profile, and then filters/sorts in-memory
// using Date parsing to ensure identical selection rules.
export async function getNextUpcomingAppointmentForPatientByEmail(email: string): Promise<{ all: Appointment[]; upcoming: Appointment[]; next: Appointment | null } | null> {
  const userEmail = String(email ?? "").trim().toLowerCase();
  if (!userEmail) return null;

  // Resolve profile id first
  const profileId = await resolveProfileIdByEmail(userEmail);
  if (!profileId) return { all: [], upcoming: [], next: null };

  // Fetch all appointments for profile id using existing helper (service-role behavior baked in)
  const all = await getAppointmentsForPatientByProfileId(profileId);

  // Use identical logic as appointments page: upcoming = rows.filter(a => new Date(a.startsAt) >= now)
  const now = new Date();
  const upcoming = (all ?? []).filter((a) => new Date(a.startsAt) >= now).sort((x, y) => new Date(x.startsAt).getTime() - new Date(y.startsAt).getTime());

  const next = upcoming.length ? upcoming[0] : null;

  // Dev debug logs to help verify parity between pages
  try {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[getNextUpcomingAppointmentForPatientByEmail] resolvedEmail:", userEmail);
      // eslint-disable-next-line no-console
      console.debug("[getNextUpcomingAppointmentForPatientByEmail] profileId:", profileId);
      // eslint-disable-next-line no-console
      console.debug("[getNextUpcomingAppointmentForPatientByEmail] totalAppointments:", (all ?? []).length);
      // eslint-disable-next-line no-console
      console.debug("[getNextUpcomingAppointmentForPatientByEmail] upcomingCount:", upcoming.length);
      // eslint-disable-next-line no-console
      console.debug("[getNextUpcomingAppointmentForPatientByEmail] nextId:", next?.id ?? null, "nextStartsAt:", next?.startsAt ?? null);
    }
  } catch (err) {}

  return { all: all ?? [], upcoming, next };
}

export async function getAppointmentsForPatientGrouped(profileId: string) {
  const all = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { upcoming: [], past: [], canceled: [], all: [] } as any;
    const { data: rows } = await supabase.from("appointments").select("*").eq("patient_id", profileId).order("starts_at", { ascending: false });
    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  });

  const now = new Date();
  const rows = (all ?? []) as Appointment[];
  const grouped = { upcoming: [] as Appointment[], past: [] as Appointment[], canceled: [] as Appointment[], all: rows };

  rows.forEach((r) => {
    if (r.status === "canceled") grouped.canceled.push(r);
    else if (new Date(r.startsAt) >= now) grouped.upcoming.push(r);
    else grouped.past.push(r);
  });

  return grouped;
}

export async function getAppointmentsForDoctorGrouped(doctorProfileId: string) {
  const all = await clientOrEmpty(async () => {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { today: [], upcoming: [], past: [], canceled: [], all: [] } as any;
    const { data: rows } = await supabase.from("appointments").select("*").eq("doctor_id", doctorProfileId).order("starts_at", { ascending: false });
    return (rows ?? []).map(mapAppointmentRowToCamel) as Appointment[];
  });

  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const rows = (all ?? []) as Appointment[];
  const grouped = { today: [] as Appointment[], upcoming: [] as Appointment[], past: [] as Appointment[], canceled: [] as Appointment[], all: rows };

  rows.forEach((r) => {
    const s = new Date(r.startsAt);
    if (r.status === "canceled") grouped.canceled.push(r);
    else if (s >= todayStart && s <= todayEnd) grouped.today.push(r);
    else if (s >= now) grouped.upcoming.push(r);
    else grouped.past.push(r);
  });

  return grouped;
}

// Generate time slots from availability and mark as unavailable when overlapping booked appointments.
export function generateSlotsFromAvailability(availability: DoctorAvailability, booked: Appointment[], referenceDate?: string) {
  const slots: Array<{
    startAt: string;
    endAt: string;
    label: string;
    isAvailable: boolean;
    appointmentId?: string | null;
  }> = [];

  function makeDate(dateStr: string, timeStr: string) {
    const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    return new Date(`${dateStr}T${t}`);
  }

  const date = availability.availabilityDate;
  const start = makeDate(date, availability.startTime);
  const end = makeDate(date, availability.endTime);
  const durationMs = (availability.slotDurationMinutes ?? 30) * 60 * 1000;
  const now = new Date();

  let cur = new Date(start.getTime());
  while (cur.getTime() + durationMs <= end.getTime()) {
    const slotEnd = new Date(cur.getTime() + durationMs);
    const slotStartIso = cur.toISOString();
    const slotEndIso = slotEnd.toISOString();

    // check overlap with booked appointments
    const overlapping = booked.find((a) => {
      const aStart = new Date(a.startsAt).getTime();
      const aEnd = new Date(a.endsAt).getTime();
      return cur.getTime() < aEnd && slotEnd.getTime() > aStart;
    });

    const isPast = slotEnd.getTime() <= now.getTime();

    slots.push({
      startAt: slotStartIso,
      endAt: slotEndIso,
      label: cur.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isAvailable: !Boolean(overlapping) && !isPast && Boolean(availability.isActive),
      appointmentId: overlapping?.id ?? null,
    });

    cur = new Date(cur.getTime() + durationMs);
  }

  return slots;
}
