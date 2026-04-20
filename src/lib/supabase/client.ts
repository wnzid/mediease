import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseCredentials } from "@/lib/supabase/env";

export function createBrowserSupabaseClient() {
  const credentials = getSupabaseCredentials();

  if (!credentials) {
    return null;
  }

  return createBrowserClient(credentials.url, credentials.anonKey);
}
