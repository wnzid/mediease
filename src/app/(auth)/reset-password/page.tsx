import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { ResetPasswordForm } from "@/features/auth/forms";
import { getDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata() {
  const dict = await getDictionary();
  return buildMetadata({
    title: t(dict, "auth.resetPage.title", "Set a new password"),
    description: t(dict, "auth.resetPage.description", "Choose a new password for your MediEase account."),
  });
}

export default async function ResetPasswordPage() {
  return (
    <AuthFormShell
      eyebrowKey="auth.resetPage.eyebrow"
      eyebrow="Secure your account"
      titleKey="auth.resetPage.title"
      title="Choose a new password"
      descriptionKey="auth.resetPage.description"
      description="Pick a password that you can remember and that keeps your workspace secure."
      alternateHref="/sign-in"
      alternateLabelKey="auth.backToSignIn"
      alternateLabel="Back to sign in"
      compact
    >
      <ResetPasswordForm />
    </AuthFormShell>
  );
}
