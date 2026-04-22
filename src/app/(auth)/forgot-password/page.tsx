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
  const dict = await getDictionary();
  return (
    <AuthFormShell
      eyebrow={t(dict, "auth.forgot.eyebrow", "Password support")}
      title={t(dict, "auth.forgot.title", "Reset your password")}
      description={t(
        dict,
        "auth.forgot.description",
        "Enter the email linked to your account and we will guide you through the next step.",
      )}
      alternateHref="/sign-in"
      alternateLabel={t(dict, "auth.backToSignIn", "Back to sign in")}
      compact
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}
