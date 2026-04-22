import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleCredentials } from "@/lib/supabase/env";

export const ADMIN_EMAIL = "admin@mediease.com";
export const ADMIN_PASSWORD = process.env.MEDIEASE_ADMIN_PASSWORD ?? "Admin123";

type AdminUser = { id: string; email?: string; user_metadata?: { full_name?: string } };

async function findUserByEmail(adminClient: SupabaseClient, email: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();
  const perPage = 100;
  let page = 1;

  while (page <= 5) {
    // listUsers accepts pagination options (page, perPage)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = await adminClient.auth.admin.listUsers({ page, perPage });
    const users = res?.data?.users ?? [];
    const match = users.find((u: unknown) => {
      const emailVal = ((u as { email?: string }).email ?? "").toLowerCase();
      return emailVal === normalized;
    }) as AdminUser | undefined;
    if (match) return match;
    if (!users.length || users.length < perPage) break;
    page += 1;
  }

  return null;
}

/**
 * Ensure a built-in admin user exists in Supabase auth + profiles.
 * - Uses the service-role key (server-only). Non-blocking if service key missing.
 * - Idempotent: will not create duplicates.
 */
export async function ensureBuiltInAdmin() {
  const creds = getSupabaseServiceRoleCredentials();
  if (!creds) {
    return null;
  }

  const adminClient = createClient(creds.url, creds.serviceRoleKey, { auth: { persistSession: false } });

  // Check if user already exists
  let user: AdminUser | null = await findUserByEmail(adminClient, ADMIN_EMAIL);

  if (!user) {
    // Create the admin user
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const createRes = await adminClient.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "admin", full_name: "MediEase Administrator" },
    });

    if (createRes?.error) {
      // If creation failed, try to find the user instead of failing hard
      user = await findUserByEmail(adminClient, ADMIN_EMAIL);
    } else {
      user = (createRes?.data?.user as AdminUser) ?? null;
    }
  }

  if (user) {
    // Ensure a profile row exists and has role=admin
    try {
      await adminClient.from("profiles").upsert(
        {
          id: user.id,
          email: ADMIN_EMAIL,
          full_name: user.user_metadata?.full_name ?? "MediEase Administrator",
          role: "admin",
          location: "Not provided",
          phone: null,
        },
        { onConflict: "id" },
      );
    } catch {
      // ignore profile upsert errors - admin user still exists in auth
    }
    return user.id;
  }

  return null;
}

export default ensureBuiltInAdmin;
