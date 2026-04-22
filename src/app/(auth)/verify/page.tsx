import Link from "next/link";
import { buildMetadata } from "@/lib/constants/site";
import { AuthFormShell } from "@/features/auth/AuthFormShell";
import { Alert } from "@/components/ui/Alert";
import { getDictionary, t } from "@/lib/i18n/server";

const dict = getDictionary();

export const metadata = buildMetadata({
  title: t(dict, "auth.verify.title", "Verify your email"),
  description: t(dict, "auth.verify.description", "Finish verification to activate your MediEase account."),
});

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthFormShell
      eyebrow={t(dict, "auth.verify.eyebrow", "Check your inbox")}
      title={t(dict, "auth.verify.title", "Verify your email address")}
      description={t(
        dict,
        "auth.verify.description",
        "We've prepared the rest of your onboarding. Verification is the final step before your role workspace becomes available.",
      )}
      alternateHref="/sign-in"
      alternateLabel={t(dict, "auth.backToSignIn", "Return to sign in")}
      compact
    >
      <div className="grid gap-5">
        <Alert
          tone="info"
          title={params.email ? `${t(dict, "auth.verify.emailSentTo")} ${params.email}` : t(dict, "auth.verify.emailSent")}
          description={t(dict, "auth.verify.checkInboxDescription", "Check your inbox and follow the verification link to complete onboarding.")}
        />
        <p className="text-sm leading-6 text-[var(--color-ink-600)]">
          {t(dict, "auth.verify.needHelp", "Need help?")} <Link href="/contact" className="font-semibold text-[var(--color-brand-700)]">{t(dict, "auth.verify.contactSupport", "Contact support")}</Link>.
        </p>
      </div>
    </AuthFormShell>
  );
}
