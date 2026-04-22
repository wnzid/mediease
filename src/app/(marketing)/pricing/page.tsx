import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Review simple platform tiers for patient access, clinics, and multi-site healthcare teams.",
});

const tiers = [
  {
    name: "Starter",
    price: "$0",
    audience: "Pilot teams",
    features: ["Trial pilot with sample data", "Patient booking journey", "Basic access controls"],
  },
  {
    name: "Clinic",
    price: "$299",
    audience: "Single clinic operations",
    features: ["Supabase-backed auth", "Doctor and staff scheduling", "Patient dashboards and notifications"],
  },
  {
    name: "Network",
    price: "Custom",
    audience: "Multi-clinic organizations",
    features: ["Admin oversight", "Multi-site reporting", "Operational policy expansion and integrations"],
  },
];

export default function PricingPage() {
  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <SectionIntro
          eyebrow="Pricing"
          title="Simple tiers for pilots, clinics, and healthcare networks"
          description="Contact us for pricing and deployment options tailored to your clinic or network."
          align="center"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.name === "Clinic" ? "border-[var(--color-brand-300)]" : "h-full"}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{tier.name}</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink-950)]">{tier.price}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{tier.audience}</p>
              <ul className="mt-5 grid gap-2.5 text-sm leading-6 text-[var(--color-ink-700)]">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkButton href="/contact" variant={tier.name === "Clinic" ? "primary" : "outline"} size="sm">
                  Talk to MediEase
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
