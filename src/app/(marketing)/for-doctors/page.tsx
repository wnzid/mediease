import Image from "next/image";
import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";

export const metadata = buildMetadata({
  title: "For Doctors and Clinics",
  description: "Explore the doctor, clinic staff, and admin sides of MediEase scheduling and operational workflows.",
});

const operationalAreas = [
  {
    title: "Doctor workspace",
    description: "Today's schedule, appointment queue, availability management, patient context, and profile settings.",
  },
  {
    title: "Clinic staff workspace",
    description: "Appointment overview, doctor schedule coordination, patient list support, and front-desk style placeholders.",
  },
  {
    title: "Admin workspace",
    description: "Users, doctors, clinics, appointments, analytics placeholders, and policy-aware oversight structure.",
  },
];

export default function ForDoctorsPage() {
  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <div className="relative rounded-2xl overflow-hidden h-56 md:h-72">
          <Image src="/stock-images/1 (4).jpg" alt="Surgeon" fill loading="eager" className="object-cover" />
        </div>
        <SectionIntro
          eyebrow="For clinics"
          title="Operational views designed for clinicians, front desks, and administrators"
          description="MediEase keeps each role focused on what matters while preserving the cross-team visibility needed to coordinate care smoothly."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {operationalAreas.map((area) => (
            <Card key={area.title} className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">{area.title}</h2>
              <p className="text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{area.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
