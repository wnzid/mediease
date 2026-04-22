import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import createManagedUser from "@/lib/auth/createManagedUser";
import { ADMIN_EMAIL } from "@/lib/auth/ensureBuiltInAdmin";

const allowedRoles = ["patient", "doctor", "staff", "admin"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const fullName = String(body?.fullName ?? "").trim();
    const password = String(body?.password ?? "").trim();
    const role = String(body?.role ?? "").trim();

    if (!email || !fullName || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Server Supabase not configured." }, { status: 500 });
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Server Supabase not configured." }, { status: 500 });

    // Ensure the caller is an authenticated admin. This is enforced server-side.
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData.user ?? null;
    if (!currentUser) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    // Resolve role from profiles table when possible.
    let isAdmin = false;
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).maybeSingle();
      if (profile && (profile as any).role === "admin") isAdmin = true;
    } catch {
      // ignore and fallback to checking email
    }

    // Keep built-in admin safe even if profile row is missing.
    const normalized = (currentUser.email ?? "").trim().toLowerCase();
    if (normalized === ADMIN_EMAIL) isAdmin = true;

    if (!isAdmin) return NextResponse.json({ error: "Access denied." }, { status: 403 });

    const result = await createManagedUser({ email, fullName, password, role: role as any });
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Failed to create user." }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId: result.userId }, { status: 201 });
  } catch (err) {
    // Log server error for debugging (do not expose details to client)
    // eslint-disable-next-line no-console
    console.error("/api/admin/users POST error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
