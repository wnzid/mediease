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
        // Do NOT mutate the incoming request cookies. Only write cookie updates to the response.
        // This prevents overwriting or clearing a valid incoming session on public routes.
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            response.cookies.set(name, value, options);
          } catch (err) {
            // swallow to avoid crashing middleware; response cookie set may fail in some environments
          }
        });
      },
    },
  });

  const userPromise = supabase.auth.getUser();

  return userPromise.then(({ data }) => ({
    response,
    userId: data.user?.id ?? null,
  }));
}
