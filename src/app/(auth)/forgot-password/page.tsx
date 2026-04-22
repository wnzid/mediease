import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { ForgotPasswordForm } from "@/features/auth/forms";
import { getDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata() {
  const dict = await getDictionary();
  return buildMetadata({
    title: t(dict, "auth.forgot.title", "Forgot password"),
    description: t(dict, "auth.forgot.description", "Reset your MediEase password with a clear recovery flow."),
  });
}

export default async function ForgotPasswordPage() {
  return (
    <AuthFormShell
      eyebrowKey="auth.forgot.eyebrow"
      eyebrow="Password support"
      titleKey="auth.forgot.title"
      title="Reset your password"
      descriptionKey="auth.forgot.description"
      description="Enter the email linked to your account and we will guide you through the next step."
      alternateHref="/sign-in"
      alternateLabelKey="auth.backToSignIn"
      alternateLabel="Back to sign in"
      compact
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}
