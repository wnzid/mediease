import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseCredentials } from "@/lib/supabase/env";

export function updateSupabaseSession(request: NextRequest) {
  const credentials = getSupabaseCredentials();
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!credentials) {
    return { response, userId: null };
  }

  const supabase = createServerClient(credentials.url, credentials.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const userPromise = supabase.auth.getUser();

  return userPromise.then(({ data }) => ({
    response,
    userId: data.user?.id ?? null,
  }));
}
