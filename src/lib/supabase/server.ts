import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseCredentials } from "@/lib/supabase/env";

export async function createServerSupabaseClient() {
  const credentials = getSupabaseCredentials();

  if (!credentials) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(credentials.url, credentials.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies directly.
        }
      },
    },
  });
}
