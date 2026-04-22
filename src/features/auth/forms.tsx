"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/useLocale";
import { useRouter, useSearchParams } from "next/navigation";
import { signInAction, signUpAction, forgotPasswordAction, resetPasswordAction, signInInternalAction } from "@/actions/auth";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useToast } from "@/components/providers/ToastProvider";
import { Icon } from "@/components/ui/Icon";
import type { AsyncActionState } from "@/types/common";
import type { SignInFields, SignUpFields, ForgotPasswordFields, ResetPasswordFields } from "@/types/auth";

const initialSignInState: AsyncActionState<SignInFields> = { success: false, message: "" };
const initialSignUpState: AsyncActionState<SignUpFields> = { success: false, message: "" };

function ActionFeedback({ success, message }: { success: boolean; message: string }) {
  const { t } = useLocale();
  const display = t(message, message);
  return <Alert tone={success ? "success" : "danger"} title={display} />;
}

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialSignInState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { t } = useLocale();
  function translateError(err?: string | null) {
    if (!err) return undefined;
    return t(err, err);
  }
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.message) return;

    addToast({
      tone: state.success ? "success" : "danger",
      title: state.success ? t("auth.signInSuccess") : t("auth.signInFailed"),
      description: t(state.message, state.message),
    });

    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [addToast, router, state]);

  async function handleGoogleSignIn() {
    setOauthError(null);
    setOauthLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setOauthError(t("auth.supabaseClientUnavailable", "Supabase client not available"));
        setOauthLoading(false);
        return;
      }
      await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
    } catch (err: any) {
      setOauthError(err?.message ?? t("auth.googleSignInError", "Could not start Google sign-in"));
      setOauthLoading(false);
    }
  }

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? <ActionFeedback success={state.success} message={state.message} /> : null}
      <div className="grid gap-3">
          <Button type="button" variant="outline" onClick={handleGoogleSignIn} loading={oauthLoading} className="w-full">
            {t("auth.continueWithGoogle")}
          </Button>
        {oauthError ? <Alert tone="danger" title={translateError(oauthError) ?? oauthError} /> : null}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--color-panel-border)]" />
          <span className="text-[12px] text-[var(--color-ink-500)]">{t("forms.or", "or")}</span>
          <span className="h-px flex-1 bg-[var(--color-panel-border)]" />
        </div>
      </div>
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
      <Input
        label={t("forms.emailLabel", "Email address")}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t("forms.emailPlaceholder", "name@example.com")}
        defaultValue={searchParams.get("email") ?? ""}
        error={translateError(state.fieldErrors?.email)}
      />
      <Input label={t("forms.passwordLabel", "Password")} name="password" type="password" autoComplete="current-password" placeholder={t("forms.passwordPlaceholder", "Enter your password")} error={translateError(state.fieldErrors?.password)} />
      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-[var(--color-brand-700)]">{t("auth.forgotPassword")}?</Link>
      </div>
      <Button type="submit" loading={isPending} iconRight="arrow_forward" className="w-full">{t("auth.continueToWorkspace")}</Button>
    </form>
  );
}

export function SignInInternalForm() {
  const [state, formAction, isPending] = useActionState(signInInternalAction, initialSignInState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { t } = useLocale();
  function translateError(err?: string | null) {
    if (!err) return undefined;
    return t(err, err);
  }

  useEffect(() => {
    if (!state.message) return;

    addToast({
      tone: state.success ? "success" : "danger",
      title: state.success ? t("auth.signInSuccess") : t("auth.signInFailed"),
      description: t(state.message, state.message),
    });

    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [addToast, router, state]);

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? <ActionFeedback success={state.success} message={state.message} /> : null}
      <input type="hidden" name="next" value={searchParams.get("next") ?? ""} />
      <Input
        label={t("forms.emailLabel", "Email address")}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={t("forms.emailPlaceholder", "name@example.com")}
        defaultValue={searchParams.get("email") ?? ""}
        error={translateError(state.fieldErrors?.email)}
      />
      <Input label={t("forms.passwordLabel", "Password")} name="password" type="password" autoComplete="current-password" placeholder={t("forms.passwordPlaceholder", "Enter your password")} error={translateError(state.fieldErrors?.password)} />
      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link href="/forgot-password" className="font-semibold text-[var(--color-brand-700)]">{t("auth.forgotPassword")}?</Link>
      </div>
      <Button type="submit" loading={isPending} iconRight="arrow_forward" className="w-full">{t("auth.continueToWorkspace")}</Button>
    </form>
  );
}

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialSignUpState);
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useLocale();
  function translateError(err?: string | null) {
    if (!err) return undefined;
    return t(err, err);
  }

  useEffect(() => {
    if (!state.message) return;

    addToast({
      tone: state.success ? "success" : "danger",
      title: state.success ? t("auth.accountReady") : t("auth.accountCreateFailed"),
      description: t(state.message, state.message),
    });

    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [addToast, router, state]);

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? <ActionFeedback success={state.success} message={state.message} /> : null}

      <Input label={t("forms.fullNameLabel", "Full name")} name="fullName" autoComplete="name" error={translateError(state.fieldErrors?.fullName)} />

      <Input label={t("forms.emailLabel", "Email address")} name="email" type="email" autoComplete="email" placeholder={t("forms.emailPlaceholder", "name@example.com")} error={translateError(state.fieldErrors?.email)} />

      <Input label={t("forms.passwordLabel", "Password")} name="password" type="password" autoComplete="new-password" hint={t("forms.passwordHint", "Use at least 10 characters.")} error={translateError(state.fieldErrors?.password)} />

      <Input label={t("forms.confirmPasswordLabel", "Confirm password")} name="confirmPassword" type="password" autoComplete="new-password" error={translateError(state.fieldErrors?.confirmPassword)} />

      <Button type="submit" loading={isPending} iconRight="arrow_forward" className="w-full">{t("auth.createAccount")}</Button>

    </form>
  );
}

const initialForgotState: AsyncActionState<ForgotPasswordFields> = { success: false, message: "" };
const initialResetState: AsyncActionState<ResetPasswordFields> = { success: false, message: "" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialForgotState);
  const { addToast } = useToast();
  const { t } = useLocale();
  function translateError(err?: string | null) {
    if (!err) return undefined;
    return t(err, err);
  }

  useEffect(() => {
    if (!state.message) return;

    addToast({
      tone: state.success ? "success" : "danger",
      title: state.success ? t("auth.resetInstructionsReady") : t("auth.resetCouldNotBeStarted"),
      description: t(state.message, state.message),
    });
  }, [addToast, state]);

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? <ActionFeedback success={state.success} message={state.message} /> : null}
      <Input label={t("forms.emailLabel", "Email address")} name="email" type="email" autoComplete="email" placeholder={t("forms.emailPlaceholder", "name@example.com")} error={translateError(state.fieldErrors?.email)} />
      <Button type="submit" loading={isPending} className="w-full">{t("auth.sendResetLink")}</Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialResetState);
  const { addToast } = useToast();
  const { t } = useLocale();
  const router = useRouter();
  function translateError(err?: string | null) {
    if (!err) return undefined;
    return t(err, err);
  }

  useEffect(() => {
    if (!state.message) return;

    addToast({
      tone: state.success ? "success" : "danger",
      title: state.success ? t("auth.passwordUpdated") : t("auth.passwordUpdateFailed"),
      description: t(state.message, state.message),
    });

    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [addToast, router, state]);

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? <ActionFeedback success={state.success} message={state.message} /> : null}
      <Input label={t("forms.passwordLabel", "Password")} name="password" type="password" autoComplete="new-password" error={translateError(state.fieldErrors?.password)} />
      <Input label={t("forms.confirmPasswordLabel", "Confirm password")} name="confirmPassword" type="password" autoComplete="new-password" error={translateError(state.fieldErrors?.confirmPassword)} />
      <Button type="submit" loading={isPending} className="w-full">{t("auth.updatePassword")}</Button>
    </form>
  );
}
