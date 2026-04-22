import { PageHeader } from "@/components/layout/PageHeader";
import { AccessibilityPreferencesForm } from "@/components/accessibility/AccessibilityPreferencesForm";
import { NotificationSettingsForm } from "@/components/forms/NotificationSettingsForm";
import { SignOutButton } from "@/features/auth/SignOutButton";
import { Card } from "@/components/ui/Card";

export default function DoctorSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Review accessibility preferences, notification controls, and workspace session options."
      />
      <section className="grid gap-5 xl:grid-cols-2">
        <AccessibilityPreferencesForm />
        <NotificationSettingsForm />
      </section>
      <Card className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">Session</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-600)]">Sign out when you are done reviewing the workspace.</p>
        </div>
        <SignOutButton />
      </Card>
    </>
  );
}
