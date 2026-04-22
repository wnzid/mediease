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
  return (
    <AuthFormShell
      showBack
      eyebrowKey="auth.signInPage.eyebrow"
      eyebrow="Welcome back"
      titleKey="auth.signInPage.title"
      title="Sign in to MediEase"
      descriptionKey="auth.signInPage.description"
      description=""
      alternateHref="/sign-up"
      alternateLabelKey="auth.createPatientAccount"
      alternateLabel="Create a patient account"
    >
      <SignInForm />
    </AuthFormShell>
  );
}
