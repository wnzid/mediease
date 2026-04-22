import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { persistRoleCookies } from "@/lib/auth/session";
import { getRoleRedirect } from "@/lib/permissions/route-permissions";

export async function POST() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 500 });
  }

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    return NextResponse.json({ error: "No authenticated user session found." }, { status: 401 });
  }

  const service = createServiceSupabaseClient();
  if (!service) {
    return NextResponse.json({ error: "Service credentials are not configured." }, { status: 500 });
  }

  try {
    const { data: existing } = await service.from("profiles").select("role").eq("id", user.id).maybeSingle();

    let role: string = (user.user_metadata?.role as string) ?? "patient";

    if (existing && existing.role) {
      role = existing.role;
    } else {
      // Create / upsert a patient profile on first OAuth login
      await service.from("profiles").upsert({
        id: user.id,
        email: user.email ?? null,
        full_name: (user.user_metadata?.full_name as string) ?? user.email ?? null,
        role: "patient",
        location: "Not provided",
        phone: null,
      });

      role = "patient";
    }

    const authUser = {
      id: user.id,
      email: user.email ?? "",
      fullName: (user.user_metadata?.full_name as string) ?? user.email ?? "MediEase user",
      role,
      avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
      clinicId: null,
    };

    await persistRoleCookies(authUser as any);

    return NextResponse.json({ role, redirectTo: getRoleRedirect(role as any) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
