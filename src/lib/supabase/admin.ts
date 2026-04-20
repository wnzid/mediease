import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleCredentials } from "@/lib/supabase/env";

/**
 * Create a Supabase client using the service role key.
 * This must only be used on the server and never exposed to the browser.
 */
export function createServiceSupabaseClient() {
  const creds = getSupabaseServiceRoleCredentials();
  if (!creds) return null;

  // Persisting a session is not needed for admin operations.
  return createClient(creds.url, creds.serviceRoleKey, { auth: { persistSession: false } });
}

export default createServiceSupabaseClient;
