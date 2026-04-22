import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { SignUpForm } from "@/features/auth/forms";
import { getDictionary, t } from "@/lib/i18n/server";

const dict = getDictionary();

export const metadata = buildMetadata({
  title: t(dict, "auth.signUp", "Patient registration"),
  description: t(dict, "auth.signUpDescription", "Create a MediEase patient account."),
});

export default function SignUpPage() {
  return (
    <AuthFormShell
      showBack
      eyebrow={t(dict, "auth.signUpPage.eyebrow", "")}
      title={t(dict, "auth.signUpPage.title", "Create your MediEase account")}
      description={t(dict, "auth.signUpPage.description", "")}
      alternateHref="/sign-in"
      alternateLabel={t(dict, "auth.alreadyHaveAccount", "Already have an account? Sign in")}
    >
      <SignUpForm />
    </AuthFormShell>
  );
}
