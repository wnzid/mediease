import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { SignUpForm } from "@/features/auth/forms";
import { getDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata() {
  const dict = await getDictionary();
  return buildMetadata({
    title: t(dict, "auth.signUp", "Patient registration"),
    description: t(dict, "auth.signUpDescription", "Create a MediEase patient account."),
  });
}

export default async function SignUpPage() {
  return (
    <AuthFormShell
      showBack
      eyebrowKey="auth.signUpPage.eyebrow"
      eyebrow=""
      titleKey="auth.signUpPage.title"
      title="Create your MediEase account"
      descriptionKey="auth.signUpPage.description"
      description=""
      alternateHref="/sign-in"
      alternateLabelKey="auth.alreadyHaveAccount"
      alternateLabel="Already have an account? Sign in"
    >
      <SignUpForm />
    </AuthFormShell>
  );
}
