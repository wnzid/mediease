import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const metadata = buildMetadata({
  title: "For Patients",
  description: "See how patients search doctors, book appointments, manage reminders, and update accessibility preferences in MediEase.",
});

const patientBenefits = [
  "Search specialists by availability, language, clinic, and telehealth support",
  "Book appointments with a clear multi-step wizard and visible confirmation summary",
  "Review upcoming visits, profile information, saved doctors, notifications, and accessibility settings",
];

export default function ForPatientsPage() {
  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <SectionIntro
          eyebrow="For patients"
          title="Book, prepare, and manage care with less friction"
          description="The patient experience centers on clarity. Each page is designed to reduce uncertainty, not add more work during already stressful healthcare moments."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {patientBenefits.map((benefit) => (
            <Card key={benefit}>
              <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">{benefit}</p>
            </Card>
          ))}
        </div>
        <LinkButton href="/sign-up" size="sm">Create a patient account</LinkButton>
      </div>
    </section>
  );
}
