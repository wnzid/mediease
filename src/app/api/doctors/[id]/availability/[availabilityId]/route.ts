import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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

export async function PATCH(req: Request, context: any) {
  try {
    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    const availabilityId = params?.availabilityId;
    const authOk = await requireDoctorMatch(doctorId);
    if (!authOk.ok) return NextResponse.json(authOk.body, { status: authOk.status });
    if (!availabilityId) return NextResponse.json({ error: "Missing availability id in path." }, { status: 400 });

    const body = await req.json();
    const { availabilityDate, startTime, endTime, slotDurationMinutes, appointmentMode, isActive, notes } = body ?? {};

    const updates: any = {};
    if (availabilityDate) updates.availability_date = availabilityDate;
    if (startTime) updates.start_time = startTime;
    if (endTime) updates.end_time = endTime;
    if (slotDurationMinutes) updates.slot_duration_minutes = slotDurationMinutes;
    if (appointmentMode) updates.appointment_mode = appointmentMode;
    if (typeof isActive === "boolean") updates.is_active = isActive;
    if (notes !== undefined) updates.notes = notes;

    // Basic validation if times provided
    if (updates.availability_date || updates.start_time || updates.end_time) {
      const ad = updates.availability_date ?? availabilityDate;
      const st = updates.start_time ?? startTime;
      const et = updates.end_time ?? endTime;
      if (ad && st && et) {
        const start = new Date(`${ad}T${st}`);
        const end = new Date(`${ad}T${et}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return NextResponse.json({ error: "Invalid start/end times." }, { status: 400 });
      }
    }

    const service = createServiceSupabaseClient();
    if (!service) return NextResponse.json({ error: "Supabase admin client unavailable." }, { status: 500 });

    // ensure row belongs to this doctor
    const { data: existing } = await service.from("doctor_availability").select("doctor_id").eq("id", availabilityId).maybeSingle();
    if (!existing || String(existing.doctor_id) !== String(doctorId)) return NextResponse.json({ error: "Not found or forbidden." }, { status: 404 });

    const { data: updated, error } = await service.from("doctor_availability").update(updates).eq("id", availabilityId).select("*").maybeSingle();
    if (error) {
      console.error("doctor_availability update error", error);
      return NextResponse.json({ error: "Failed to update availability." }, { status: 500 });
    }

    return NextResponse.json({ success: true, availability: mapRow(updated) });
  } catch (err) {
    console.error("/api/doctors/[id]/availability/[availabilityId] PATCH error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const params = context?.params ? (typeof context.params.then === "function" ? await context.params : context.params) : null;
    const doctorId = params?.id;
    const availabilityId = params?.availabilityId;
    const authOk = await requireDoctorMatch(doctorId);
    if (!authOk.ok) return NextResponse.json(authOk.body, { status: authOk.status });
    if (!availabilityId) return NextResponse.json({ error: "Missing availability id in path." }, { status: 400 });

    const service = createServiceSupabaseClient();
    if (!service) return NextResponse.json({ error: "Supabase admin client unavailable." }, { status: 500 });

    // ensure row belongs to this doctor
    const { data: existing } = await service.from("doctor_availability").select("doctor_id").eq("id", availabilityId).maybeSingle();
    if (!existing || String(existing.doctor_id) !== String(doctorId)) return NextResponse.json({ error: "Not found or forbidden." }, { status: 404 });

    // Soft-delete / deactivate
    const { error } = await service.from("doctor_availability").update({ is_active: false }).eq("id", availabilityId);
    if (error) {
      console.error("doctor_availability deactivate error", error);
      return NextResponse.json({ error: "Failed to deactivate availability." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/doctors/[id]/availability/[availabilityId] DELETE error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
