"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLocale } from "@/lib/i18n/useLocale";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
          setError(t("auth.supabaseClientUnavailable", "Supabase client not available"));
          setLoading(false);
          return;
        }

        // Try to ensure we have the current session in the browser after redirect.
        // `getSessionFromUrl` is not available on all client types; use `getSession` which is typed.
        try {
          await supabase.auth.getSession();
        } catch (e) {
          // ignore any errors — we'll check user below
        }

        const { data } = await supabase.auth.getUser();
        if (!data?.user) {
          setError(t("auth.oauth.noUser", "No authenticated user found after OAuth."));
          setLoading(false);
          return;
        }

        // Let the server finalize profile upsert and persist role cookie
        const resp = await fetch("/api/auth/complete", { method: "POST", credentials: "same-origin" });
        const json = await resp.json();

        if (!resp.ok) {
          setError(json?.error ?? t("auth.oauth.serverError", "Could not complete OAuth sign-in on server."));
          setLoading(false);
          return;
        }

        if (json?.redirectTo) {
          router.replace(json.redirectTo);
          return;
        }

        setError(t("auth.oauth.noRedirect", "Authentication completed but no redirect path was returned."));
      } catch (err: any) {
        setError(err?.message ?? t("auth.oauth.unknown", String(err) ?? "An unknown error occurred"));
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-6 text-center">
        {loading ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("auth.oauth.completingTitle", "Completing sign in")}</h2>
            <p className="text-sm text-[var(--color-ink-600)]">{t("auth.oauth.completingBody", "Finishing your sign in and preparing your workspace.")}</p>
            <div className="mt-4">
              <Button loading />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("auth.oauth.errorTitle", "Sign in error")}</h2>
            <p className="text-sm text-[var(--color-ink-600)]">{error}</p>
            <div className="mt-4">
              <Button onClick={() => router.replace("/sign-in")}>{t("auth.backToSignIn", "Return to sign-in")}</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t("auth.oauth.redirectingTitle", "Redirecting…")}</h2>
            <p className="text-sm text-[var(--color-ink-600)]">{t("auth.oauth.redirectingBody", "If you are not redirected shortly, use the button below.")}</p>
            <div className="mt-4">
              <Button onClick={() => router.replace("/")}>{t("auth.goHome", "Go to home")}</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
