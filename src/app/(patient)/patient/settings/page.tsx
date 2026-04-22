import { PageHeader } from "@/components/layout/PageHeader";
import { AccessibilityPreferencesForm } from "@/components/accessibility/AccessibilityPreferencesForm";
import { NotificationSettingsForm } from "@/components/forms/NotificationSettingsForm";

export default function PatientSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Control accessibility, reminders, and communication preferences from one place."
      />
      <section className="grid gap-5 xl:grid-cols-2">
        <AccessibilityPreferencesForm />
        <NotificationSettingsForm />
      </section>
    </>
  );
}
