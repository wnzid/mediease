import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const metadata = buildMetadata({
  title: "Appointments",
  description: "Learn how to book appointments, visit types, and what to expect at your visit.",
});

export default function AppointmentsPage() {
  return (
    <>
      <section className="marketing-section">
        <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <SectionIntro
            eyebrow="Appointments"
            title="Book care that fits your needs"
            description="Information on appointment types, what to bring, and how to prepare for visits - with clear steps to book online or by phone."
          />

          <Card className="space-y-4">
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src="/stock-images/1 (1).jpg" alt="Patient room" fill loading="eager" className="object-cover" />
            </div>
            <div className="grid gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
              <p className="font-semibold">Appointment types</p>
              <ul className="list-disc pl-5">
                <li>General consultation and follow-up visits</li>
                <li>Specialist consultation and referrals</li>
                <li>Pre-op and post-op checks</li>
                <li>Telehealth and in-person options</li>
              </ul>
            </div>
            <div className="mt-4">
              <LinkButton href="/patient/book">Start booking</LinkButton>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
