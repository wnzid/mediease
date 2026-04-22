import Image from "next/image";
import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";
import { CallToActionBanner } from "@/features/marketing/sections";

export const metadata = buildMetadata({
  title: "About",
  description: "Learn about MediEase Hospital - our mission, care approach, and facilities.",
});

export default function AboutPage() {
  return (
    <>
      <section className="marketing-section">
        <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <SectionIntro
            eyebrow="About MediEase"
            title="MediEase Hospital - patient-centered care you can trust"
            description="We provide compassionate, coordinated care across specialties. Our teams focus on safety, clear communication, and practical support for patients and families."
          />
          <Card className="space-y-4">
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src="/stock-images/1 (2).jpg" alt="Care team" fill loading="eager" className="object-cover" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">What matters to patients</p>
            <ul className="grid gap-3 text-sm leading-6 text-[var(--color-ink-700)] md:text-base">
              <li>Patient-first care with clear communication and follow-up.</li>
              <li>Experienced clinicians across key specialties.</li>
              <li>Modern facilities and coordinated inpatient services.</li>
            </ul>
          </Card>
        </div>
      </section>
      <CallToActionBanner />
    </>
  );
}
