import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

    const { data: authData } = await supabase.auth.getUser();
    const uid = authData?.user?.id ?? null;
    if (!uid) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("id,role,full_name,email").eq("auth_user_id", uid).maybeSingle();
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

    if (profile.role !== "doctor") return NextResponse.json({ error: "Not a doctor." }, { status: 403 });

    return NextResponse.json({ doctorId: profile.id, profile });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/doctors/me error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
