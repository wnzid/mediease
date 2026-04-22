import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { roleHomePaths } from "@/lib/constants/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ensureBuiltInAdmin, { ADMIN_EMAIL } from "@/lib/auth/ensureBuiltInAdmin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AuthUser, SessionContext, UserRole } from "@/types/auth";

const ROLE_COOKIE = "mediease-role";

type RawProfileRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
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

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, avatar_url, clinic_id, location")
    .eq("id", authData.user.id)
    .maybeSingle();

  const profile = data as RawProfileRow | null;
  let role = profile?.role ?? ((authData.user.user_metadata.role as Exclude<UserRole, "guest"> | undefined) ?? "patient");

  // If no profile exists but the logged-in email is the built-in admin, treat as admin and try to upsert a profile.
  try {
    const normalized = (authData.user.email ?? "").trim().toLowerCase();
    if (!profile && normalized === ADMIN_EMAIL) {
      role = "admin";

      // Best-effort: ensure built-in admin and upsert a profile row.
      try {
        await ensureBuiltInAdmin();
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          email: ADMIN_EMAIL,
          full_name: (authData.user.user_metadata?.full_name as string) ?? ADMIN_EMAIL,
          role: "admin",
          location: "Not provided",
          phone: null,
        });
      } catch {
        // ignore - role was already set to admin
      }
    }
  } catch {
    // ignore any errors and fall back to previous role resolution
  }

  return {
    id: authData.user.id,
    email: profile?.email ?? authData.user.email ?? "",
    fullName:
      profile?.full_name ??
      ((authData.user.user_metadata.full_name as string | undefined) ?? authData.user.email ?? "MediEase user"),
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
