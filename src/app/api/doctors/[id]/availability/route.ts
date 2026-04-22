import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function mapRow(r: any) {
  return {
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
  };
}

async function requireDoctorMatch(paramsId: string) {
  if (!isSupabaseConfigured()) return { ok: false, status: 500, body: { error: "Supabase not configured." } };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { ok: false, status: 500, body: { error: "Supabase not configured." } };
  const { data: authData } = await supabase.auth.getUser();
  const uid = authData?.user?.id ?? null;
  if (!uid) return { ok: false, status: 401, body: { error: "Unauthorized." } };

  const { data: profile } = await supabase.from("profiles").select("id,role").eq("auth_user_id", uid).maybeSingle();
  if (!profile) return { ok: false, status: 403, body: { error: "Profile not found." } };

  // Only the owning doctor may manage availability
  if (String(profile.id) !== String(paramsId)) return { ok: false, status: 403, body: { error: "Forbidden." } };

  return { ok: true, profile };
}

export async function GET(req: Request, context: any) {
  try {
    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    // Public listing: return active availabilities for the doctor
    const { data: rows } = await supabase.from("doctor_availability").select("*").eq("doctor_id", doctorId).order("availability_date", { ascending: true });
    const mapped = (rows ?? []).map(mapRow);
    return NextResponse.json({ availability: mapped });
  } catch (err) {
    console.error("/api/doctors/[id]/availability GET error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function POST(req: Request, context: any) {
  try {
    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    const authOk = await requireDoctorMatch(doctorId);
    if (!authOk.ok) return NextResponse.json(authOk.body, { status: authOk.status });

    const body = await req.json();
    const { availabilityDate, startTime, endTime, slotDurationMinutes, appointmentMode, notes } = body ?? {};

    if (!availabilityDate || !startTime || !endTime || !slotDurationMinutes) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Basic validations
    const start = new Date(`${availabilityDate}T${startTime}`);
    const end = new Date(`${availabilityDate}T${endTime}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: "Invalid start/end times." }, { status: 400 });
    }
    if (!(Number(slotDurationMinutes) > 0)) return NextResponse.json({ error: "Invalid slot duration." }, { status: 400 });

    // block past dates by default
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availDate = new Date(availabilityDate + "T00:00:00");
    if (availDate.getTime() < today.getTime()) return NextResponse.json({ error: "Cannot create availability in the past." }, { status: 400 });

    if (!["in-person", "telehealth"].includes(appointmentMode)) return NextResponse.json({ error: "Invalid appointment mode." }, { status: 400 });

    const service = createServiceSupabaseClient();
    if (!service) return NextResponse.json({ error: "Supabase admin client unavailable." }, { status: 500 });

    const row: any = {
      doctor_id: doctorId,
      availability_date: availabilityDate,
      start_time: startTime,
      end_time: endTime,
      slot_duration_minutes: slotDurationMinutes,
      appointment_mode: appointmentMode,
      is_active: true,
      notes: notes ?? null,
    };

    const { data: created, error } = await service.from("doctor_availability").insert(row).select("*").maybeSingle();
    if (error) {
      console.error("doctor_availability insert error", error);
      return NextResponse.json({ error: "Failed to create availability." }, { status: 500 });
    }

    return NextResponse.json({ success: true, availability: mapRow(created) });
  } catch (err) {
    console.error("/api/doctors/[id]/availability POST error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

// PATCH and DELETE have been moved to the availabilityId child route
