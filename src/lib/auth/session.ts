import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { roleHomePaths } from "@/lib/constants/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import createServiceSupabaseClient from "@/lib/supabase/admin";
import ensureBuiltInAdmin, { ADMIN_EMAIL } from "@/lib/auth/ensureBuiltInAdmin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AuthUser, SessionContext, UserRole } from "@/types/auth";

const ROLE_COOKIE = "mediease-role";

type RawProfileRow = {
  id: string;
  full_name: string;
  email: string;
  role: Exclude<UserRole, "guest">;
  avatar_url: string | null;
  clinic_id: string | null;
  location: string | null;
};

// Demo mode removed: session resolution relies solely on Supabase profiles.

async function readSupabaseUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  // Resolve profile robustly: profiles.id == auth.id, then profiles.auth_user_id == auth.id, then profiles.email == auth.email
  const uid = authData.user.id;
  const normalizedEmail = (authData.user.email ?? "").trim().toLowerCase() || null;

  let profile: RawProfileRow | null = null;
  let resolvedProfileId: string | null = null;
  let role: UserRole | Exclude<UserRole, "guest"> = ((authData.user.user_metadata.role as Exclude<UserRole, "guest"> | undefined) ?? "patient");

  // (no debug logging)

  try {
    // 1) Try profiles.id == uid
    const byId = await supabase.from("profiles").select("id, full_name, email, role, avatar_url, clinic_id, location, auth_user_id").eq("id", uid).maybeSingle();
    if (byId?.data) {
      profile = byId.data as RawProfileRow;
      resolvedProfileId = profile.id;
    }

    // 2) Try profiles.auth_user_id == uid
    if (!profile) {
      const byAuth = await supabase.from("profiles").select("id, full_name, email, role, avatar_url, clinic_id, location, auth_user_id").eq("auth_user_id", uid).maybeSingle();
      if (byAuth?.data) {
        profile = byAuth.data as RawProfileRow;
        resolvedProfileId = profile.id;
      }
    }

    // 3) Fallback to email match (case-insensitive)
    if (!profile && normalizedEmail) {
      const byEmail = await supabase.from("profiles").select("id, full_name, email, role, avatar_url, clinic_id, location, auth_user_id").ilike("email", normalizedEmail).maybeSingle();
      if (byEmail?.data) {
        profile = byEmail.data as RawProfileRow;
        resolvedProfileId = profile.id;
      }
    }

    // If still no profile but the auth email is the built-in admin, upsert an admin profile (best-effort)
    if (!profile) {
      const normalized = (authData.user.email ?? "").trim().toLowerCase();
      if (normalized === ADMIN_EMAIL) {
        role = "admin";
        try {
          await ensureBuiltInAdmin();
          await supabase.from("profiles").upsert({
            id: uid,
            email: ADMIN_EMAIL,
            full_name: (authData.user.user_metadata?.full_name as string) ?? ADMIN_EMAIL,
            role: "admin",
            location: "Not provided",
          });
          const byIdAfter = await supabase.from("profiles").select("id, full_name, email, role, avatar_url, clinic_id, location, auth_user_id").eq("id", uid).maybeSingle();
          if (byIdAfter?.data) {
            profile = byIdAfter.data as RawProfileRow;
            resolvedProfileId = profile.id;
          }
        } catch {
          // ignore
        }
      }
    }
  } catch (e) {
    // If any lookup errors, continue with auth fallback.
  }

  // Temporary service-role sanity check: query profiles by auth_user_id using service client
  try {
    const enableServiceFallback = (process.env.ENABLE_SERVICE_FALLBACK ?? "true") === "true";
    const adminClient = createServiceSupabaseClient();
    if (adminClient) {
      const svcRes = await adminClient.from("profiles").select("id, full_name, email, role, avatar_url, clinic_id, location, auth_user_id").eq("auth_user_id", uid).maybeSingle();
      if (svcRes?.data && !resolvedProfileId && (process.env.ENABLE_SERVICE_FALLBACK ?? "true") === "true") {
        profile = svcRes.data as RawProfileRow;
        resolvedProfileId = profile.id;
      }
    }
  } catch (e) {
    // service-role lookup failed silently
  }

  // Prefer role from profile when available
  if (profile?.role) role = profile.role as Exclude<UserRole, "guest">;

  // (no debug logging)

  return {
    id: profile?.id ?? authData.user.id,
    email: profile?.email ?? authData.user.email ?? "",
    fullName: profile?.full_name ?? ((authData.user.user_metadata.full_name as string | undefined) ?? authData.user.email ?? "MediEase user"),
    role,
    avatarUrl: profile?.avatar_url ?? null,
    clinicId: profile?.clinic_id ?? null,
  };
}

export async function getSessionContext(): Promise<SessionContext> {
  const supabaseUser = await readSupabaseUser();

  if (supabaseUser) {
    return {
      isAuthenticated: true,
      isDemo: false,
      role: supabaseUser.role,
      user: supabaseUser,
    };
  }

  return {
    isAuthenticated: false,
    isDemo: false,
    role: "guest",
    user: null,
  };
}

export async function requireRole(role: Exclude<UserRole, "guest">) {
  const session = await getSessionContext();

  if (!session.user) {
    redirect(`/sign-in?next=${encodeURIComponent(roleHomePaths[role])}`);
  }

  if (session.user.role === "guest") {
    redirect(`/sign-in?next=${encodeURIComponent(roleHomePaths[role])}`);
  }

  if (session.user.role !== role) {
    redirect(roleHomePaths[session.user.role]);
  }

  return {
    ...session,
    user: session.user,
  };
}

export async function persistRoleCookies(user: AuthUser) {
  const cookieStore = await cookies();

  cookieStore.set(ROLE_COOKIE, user.role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ROLE_COOKIE);
}

export async function getRoleCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ROLE_COOKIE)?.value as UserRole | undefined;
  return value ?? "guest";
}

// demo helper removed
