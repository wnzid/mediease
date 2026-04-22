"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { AsyncActionState } from "@/types/common";
import type {
  ForgotPasswordFields,
  ResetPasswordFields,
  SignInFields,
  SignUpFields,
} from "@/types/auth";
import { getRoleRedirect } from "@/lib/permissions/route-permissions";
import { clearSessionCookies, persistRoleCookies } from "@/lib/auth/session";
import ensureBuiltInAdmin, { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth/ensureBuiltInAdmin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  validateForgotPassword,
  validateResetPassword,
  validateSignIn,
  validateSignUp,
} from "@/lib/validators/forms";

function formValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function signInAction(
  _previousState: AsyncActionState<SignInFields>,
  formData: FormData,
): Promise<AsyncActionState<SignInFields>> {
  const fields: SignInFields = {
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  };
  const next = formValue(formData, "next");
  const fieldErrors = validateSignIn(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "auth.messages.correctHighlightedFields",
      fieldErrors,
    };
  }

  const normalized = fields.email.trim().toLowerCase();

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfiguredSignIn",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "auth.messages.supabaseEnvMissing",
    };
  }

  // Ensure the built-in admin exists in Supabase (idempotent). Only run when the attempted login is the admin email.
  if (normalized === ADMIN_EMAIL) {
    try {
      await ensureBuiltInAdmin();
    } catch (e) {
      // don't block login attempts on ensure errors; fall through to normal sign-in which may succeed
      console.error("ensureBuiltInAdmin failed:", e);
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: fields.email,
    password: fields.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? "auth.messages.signInFailedCredentials",
    };
  }

  // After auth, resolve role from the canonical profiles table when possible.
  let role = (data.user.user_metadata.role as SignUpFields["role"] | undefined) ?? "patient";
  let fullName = (data.user.user_metadata.full_name as string | undefined) ?? data.user.email ?? "MediEase user";

  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, role, avatar_url, clinic_id, location")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileData) {
      role = (profileData.role as SignUpFields["role"]) ?? role ?? "patient";
      fullName = (profileData.full_name as string) ?? fullName;
    } else {
      // If no profile exists but this is the built-in admin email, ensure and upsert a profile for it.
      if (normalized === ADMIN_EMAIL) {
        try {
          // Ensure the built-in admin (idempotent). This may create the auth user and profile using the service-role key.
          await ensureBuiltInAdmin();

          // Try to upsert a profile row using the same server client (may require appropriate DB policies).
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: ADMIN_EMAIL,
            full_name: fullName,
            role: "admin",
            location: "Not provided",
            phone: null,
          });
        } catch {
          // best-effort: even if upsert fails due to RLS, force the session role to admin
        }

        role = "admin";
      }
    }
  } catch {
    // ignore profile lookup errors and keep role from metadata or default
  }

  const user = {
    id: data.user.id,
    email: data.user.email ?? fields.email,
    fullName,
    role,
    avatarUrl: null,
  };

  await persistRoleCookies(user);

  return {
    success: true,
    message: "auth.messages.welcomeBack",
    redirectTo: next || getRoleRedirect(role),
  };
}

export async function signInInternalAction(
  _previousState: AsyncActionState<SignInFields>,
  formData: FormData,
): Promise<AsyncActionState<SignInFields>> {
  const fields: SignInFields = {
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  };
  const next = formValue(formData, "next");
  const fieldErrors = validateSignIn(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "auth.messages.correctHighlightedFields",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfiguredSignIn",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "auth.messages.supabaseEnvMissing",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: fields.email,
    password: fields.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? "auth.messages.signInFailedCredentials",
    };
  }

  // Resolve role from canonical profiles table when possible
  let role = (data.user.user_metadata.role as SignUpFields["role"] | undefined) ?? "patient";
  let fullName = (data.user.user_metadata.full_name as string | undefined) ?? data.user.email ?? "MediEase user";

  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, role, avatar_url, clinic_id, location")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileData) {
      role = (profileData.role as SignUpFields["role"]) ?? role ?? "patient";
      fullName = (profileData.full_name as string) ?? fullName;
    }
  } catch {
    // ignore profile lookup errors and keep role from metadata or default
  }

  // Internal sign-in must be doctor/staff/admin only
  if (!["doctor", "staff", "admin"].includes(role)) {
    return {
      success: false,
      message: "auth.messages.internalOnly",
    };
  }

  const user = {
    id: data.user.id,
    email: data.user.email ?? fields.email,
    fullName,
    role,
    avatarUrl: null,
  };

  await persistRoleCookies(user);

  return {
    success: true,
    message: "auth.messages.welcomeBack",
    redirectTo: next || getRoleRedirect(role),
  };
}

export async function signUpAction(
  _previousState: AsyncActionState<SignUpFields>,
  formData: FormData,
): Promise<AsyncActionState<SignUpFields>> {
  const headersList = await headers();
  const origin = headersList.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fields: SignUpFields = {
    fullName: formValue(formData, "fullName"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    confirmPassword: formValue(formData, "confirmPassword"),
    // Public signup must always be a patient. Ignore any incoming role.
    role: "patient",
    phone: formValue(formData, "phone") || "",
    agreedToTerms: formValue(formData, "agreedToTerms") || "",
  };
  const fieldErrors = validateSignUp(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "auth.messages.correctHighlightedFields",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfiguredSignUp",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfigured",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: fields.email,
    password: fields.password,
    options: {
      emailRedirectTo: `${origin}/verify`,
      data: {
        full_name: fields.fullName,
        role: "patient",
        phone: fields.phone || null,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fields.fullName,
      email: fields.email,
      phone: fields.phone || null,
      role: "patient",
      location: "Not provided",
      pronouns: null,
    });
  }

  return {
    success: true,
    message: "auth.messages.accountCreatedVerifyEmail",
    redirectTo: `/verify?email=${encodeURIComponent(fields.email)}`,
  };
}

export async function forgotPasswordAction(
  _previousState: AsyncActionState<ForgotPasswordFields>,
  formData: FormData,
): Promise<AsyncActionState<ForgotPasswordFields>> {
  const headersList = await headers();
  const origin = headersList.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fields: ForgotPasswordFields = {
    email: formValue(formData, "email"),
  };
  const fieldErrors = validateForgotPassword(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "forms.invalidEmail",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfigured",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfigured",
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(fields.email, {
    redirectTo: `${origin}/reset-password`,
  });

  return {
    success: !error,
    message: error ? error.message : "auth.messages.passwordResetSent",
  };
}

export async function resetPasswordAction(
  _previousState: AsyncActionState<ResetPasswordFields>,
  formData: FormData,
): Promise<AsyncActionState<ResetPasswordFields>> {
  const fields: ResetPasswordFields = {
    password: formValue(formData, "password"),
    confirmPassword: formValue(formData, "confirmPassword"),
  };
  const fieldErrors = validateResetPassword(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "auth.messages.reviewNewPasswordFields",
      fieldErrors,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfigured",
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "auth.messages.supabaseNotConfigured",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: fields.password,
  });

  return {
    success: !error,
    message: error ? error.message : "auth.messages.passwordUpdated",
    redirectTo: error ? undefined : "/sign-in",
  };
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  await clearSessionCookies();
  revalidatePath("/");
}
