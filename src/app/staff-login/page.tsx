import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { SignInInternalForm } from "@/features/auth/forms";

export const metadata = buildMetadata({
  title: "Staff sign in",
  description: "Sign in for MediEase staff and clinicians.",
});

export default function StaffLoginPage() {
  return (
    <AuthFormShell eyebrow="Team access" title="Staff & clinician sign in" description="Sign in for internal staff. Accounts are created by admins.">
      <SignInInternalForm />
    </AuthFormShell>
  );
}
