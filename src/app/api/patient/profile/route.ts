import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user ?? null;
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    // Resolve canonical profile id robustly. Auth user id may not equal profiles.id; try multiple fallbacks.
    const uid = user.id;
    const normalizedEmail = (user.email ?? "").trim().toLowerCase() || null;

    let profile: any = null;
    let patient: any = null;

    // 1) Try profiles.id == uid
    try {
      const byId = await supabase.from("profiles").select("id, full_name, email, phone, location").eq("id", uid).maybeSingle();
      if (byId?.data) profile = byId.data;
    } catch (e) {
      // ignore
    }

    // 2) Try profiles.auth_user_id == uid
    if (!profile) {
      try {
        const byAuth = await supabase.from("profiles").select("id, full_name, email, phone, location, auth_user_id").eq("auth_user_id", uid).maybeSingle();
        if (byAuth?.data) profile = byAuth.data;
      } catch (e) {
        // ignore
      }
    }

    // 3) Fallback: match by email
    if (!profile && normalizedEmail) {
      try {
        const byEmail = await supabase.from("profiles").select("id, full_name, email, phone, location").ilike("email", normalizedEmail).maybeSingle();
        if (byEmail?.data) profile = byEmail.data;
      } catch (e) {
        // ignore
      }
    }

    // Fetch patient_profiles row for the resolved profile id if available
    try {
      if (profile?.id) {
        const { data: patientRow } = await supabase.from("patient_profiles").select("*").eq("id", profile.id).maybeSingle();
        patient = patientRow ?? null;
      } else {
        // If no profile resolved, try patient_profiles by uid (best-effort)
        const { data: patientRow } = await supabase.from("patient_profiles").select("*").eq("id", uid).maybeSingle();
        patient = patientRow ?? null;
        if (patient && !profile) {
          const { data: prof } = await supabase.from("profiles").select("id, full_name, email, phone, location").eq("id", patient.id).maybeSingle();
          profile = prof ?? null;
        }
      }
    } catch (e) {
      // ignore; best-effort
    }

    return NextResponse.json({ profile: profile ?? null, patient: patient ?? null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/patient/profile GET error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user ?? null;
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = await req.json();

    // Map incoming fields to the canonical patient/profile schema where possible.
    const profileUpdate: any = {};
    if (body.phone) profileUpdate.phone = body.phone;
    if (body.address) profileUpdate.location = body.address;

    const patientUpsert: any = {};
    if (body.date_of_birth) patientUpsert.date_of_birth = body.date_of_birth;
    if (body.insurance_provider) patientUpsert.insurance_provider = body.insurance_provider;
    if (body.insurance_member_id) patientUpsert.insurance_member_id = body.insurance_member_id;
    if (body.emergency_contact_name) patientUpsert.emergency_contact_name = body.emergency_contact_name;
    if (body.emergency_contact_relationship) patientUpsert.emergency_contact_relationship = body.emergency_contact_relationship;
    if (body.emergency_contact_phone) patientUpsert.emergency_contact_phone = body.emergency_contact_phone;

    // Arrays: ensure text[] format for conditions/medications/allergies
    if (body.conditions) patientUpsert.conditions = Array.isArray(body.conditions) ? body.conditions : String(body.conditions).split(",").map((s: string) => s.trim()).filter(Boolean);
    if (body.medications) patientUpsert.medications = Array.isArray(body.medications) ? body.medications : String(body.medications).split(",").map((s: string) => s.trim()).filter(Boolean);
    if (body.allergies) patientUpsert.allergies = Array.isArray(body.allergies) ? body.allergies : String(body.allergies).split(",").map((s: string) => s.trim()).filter(Boolean);

    // Try updating profile first (phone/address)
    if (Object.keys(profileUpdate).length > 0) {
      await supabase.from("profiles").update(profileUpdate).eq("id", user.id);
    }

    // Upsert into `patient_profiles` (id == profile id)
    const patientPayload: any = { id: user.id, ...patientUpsert };
    const { error: upsertError } = await supabase.from("patient_profiles").upsert(patientPayload, { onConflict: "id" });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/patient/profile POST error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
