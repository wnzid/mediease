import createServiceSupabaseClient from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL } from "@/lib/auth/ensureBuiltInAdmin";

type CreateManagedUserParams = {
  email: string;
  fullName: string;
  password: string;
  role: "patient" | "doctor" | "staff" | "admin";
};

/**
 * Create an auth user with the Supabase service role, then create a matching profile row.
 * The function attempts to keep auth and profile in sync. If profile insert fails after
 * creating the auth user, it will attempt to delete the newly created auth user as cleanup.
 *
 * IMPORTANT: This runs on the server only and MUST NOT be exposed to the browser.
 */
export async function createManagedUser({ email, fullName, password, role }: CreateManagedUserParams) {
  const adminClient: SupabaseClient | null = createServiceSupabaseClient();
  if (!adminClient) {
    return { success: false, error: "Server is not configured for managed user creation." };
  }

  try {
    const createRes = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

    if (createRes?.error) {
      console.error("createManagedUser: auth.createUser error:", createRes.error);
    }

    const user = (createRes?.data as any)?.user ?? null;

    if (!user || createRes?.error) {
      return { success: false, error: "Could not create auth user." };
    }

    const { error: profileError } = await adminClient.from("profiles").insert({
      id: user.id,
      email,
      full_name: fullName,
      role,
    });

    if (profileError) {
      console.error("createManagedUser: profiles.insert error:", profileError);

      try {
        await adminClient.auth.admin.deleteUser(user.id);
      } catch {}

      return { success: false, error: "Created auth user but failed to create profile." };
    }

    return { success: true, userId: user.id };
  } catch (err) {
    console.error("createManagedUser unexpected error:", err);
    return { success: false, error: "Unexpected server error creating user." };
  }
}

export default createManagedUser;