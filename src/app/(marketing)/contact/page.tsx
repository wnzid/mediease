import { buildMetadata, siteConfig } from "@/lib/constants/site";
import Link from "next/link";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact MediEase Hospital for appointments, directions, and urgent information.",
});

export default function ContactPage() {
  return (
    <section className="marketing-section">
      <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <SectionIntro
          eyebrow="Contact"
          title="Get in touch with our care team"
          description="Phone, email, and visiting information - here’s how to reach us and when to come in."
        />
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">Main contact</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{siteConfig.supportEmail}</p>
            <p className="text-sm text-[var(--color-ink-600)]">Phone: {siteConfig.phone}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">Address & hours</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{siteConfig.address}</p>
            <p className="text-sm text-[var(--color-ink-600)]">Hours: {siteConfig.openingHours}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">Emergency</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{siteConfig.emergencyPhone}</p>
            <p className="text-sm text-[var(--color-ink-600)]">If this is a medical emergency, call your local emergency number immediately.</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">Helpful links</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--color-ink-600)] md:text-base">
              <li>
                <Link href="/appointments" className="hover:underline">How to book an appointment</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">Frequently asked questions</Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:underline">Accessibility support</Link>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}
