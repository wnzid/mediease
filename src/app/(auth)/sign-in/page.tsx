import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { SignInForm } from "@/features/auth/forms";
import { getDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata() {
  const dict = await getDictionary();
  return buildMetadata({
    title: t(dict, "auth.signIn", "Sign in"),
    description: t(dict, "auth.signInDescription", "Sign in for patients, doctors, and administrators."),
  });
}

export default async function SignInPage() {
  const dict = await getDictionary();
  return (
    <AuthFormShell
      showBack
      eyebrow={t(dict, "auth.signInPage.eyebrow", "Welcome back")}
      title={t(dict, "auth.signInPage.title", "Sign in to MediEase")}
      description={t(dict, "auth.signInPage.description", "")}
      alternateHref="/sign-up"
      alternateLabel={t(dict, "auth.createPatientAccount", "Create a patient account")}
    >
      <SignInForm />
    </AuthFormShell>
  );
}
