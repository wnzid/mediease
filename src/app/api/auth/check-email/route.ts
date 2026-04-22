import { NextResponse } from "next/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) return NextResponse.json({ exists: false });

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });
    }

    // First try the profiles table (fast, permission-safe)
    const serverClient = await createServerSupabaseClient();
    if (serverClient) {
      try {
        const { data: profile } = await serverClient.from("profiles").select("id,email,full_name").ilike("email", email).maybeSingle();
        if (profile) return NextResponse.json({ exists: true, source: "profile", profile });
      } catch (e) {
        // continue to auth check if profiles lookup fails
      }
    }

    // Fall back to checking auth users via the service role (if configured)
    const service = createServiceSupabaseClient();
    if (service) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const res = await service.auth.admin.listUsers({ perPage: 100, page: 1 });
        const users = (res?.data?.users ?? []) as any[];
        const match = users.find((u) => ((u?.email ?? "").toLowerCase() === email));
        if (match) return NextResponse.json({ exists: true, source: "auth", userId: match.id });
      } catch (e) {
        // swallow and treat as not found
      }
    }

    return NextResponse.json({ exists: false });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/check-email error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
