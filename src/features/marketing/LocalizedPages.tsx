"use client";

import Image from "next/image";
import Link from "next/link";
import { BookingWizard } from "@/components/appointments/BookingWizard";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/constants/site";
import { useLocale } from "@/lib/i18n/useLocale";
import type { Clinic } from "@/types/clinics";
import type { Doctor } from "@/types/doctors";

type BookingOption = Readonly<{ label: string; value: string; description: string }>;

export function PublicBookPageContent({
  doctorId,
  doctors,
  clinics,
  appointmentTypes,
  appointmentModeOptions,
}: {
  doctorId?: string;
  doctors: Doctor[];
  clinics: Clinic[];
  appointmentTypes: ReadonlyArray<BookingOption>;
  appointmentModeOptions: ReadonlyArray<BookingOption>;
}) {
  const { t } = useLocale();

  return (
    <section className="marketing-section">
      <div className="layout-container">
        <PageHeader
          title={t("patient.booking.title", "Book an appointment")}
          description={t("patient.booking.description", "Move through a calm, validated booking flow with your summary visible from start to finish.")}
        />
        <div className="mt-6">
          <BookingWizard
            initialDoctorId={doctorId}
            doctors={doctors}
            clinics={clinics}
            appointmentTypes={appointmentTypes}
            appointmentModeOptions={appointmentModeOptions}
          />
        </div>
      </div>
    </section>
  );
}

export function BookFlowContent({
  doctorId,
  doctors,
  clinics,
  appointmentTypes,
  appointmentModeOptions,
}: {
  doctorId?: string;
  doctors: Doctor[];
  clinics: Clinic[];
  appointmentTypes: ReadonlyArray<BookingOption>;
  appointmentModeOptions: ReadonlyArray<BookingOption>;
}) {
  const { t } = useLocale();

  return (
    <div className="layout-container">
      <PageHeader
        title={t("patient.booking.title", "Book an appointment")}
        description={t("patient.booking.description", "Move through a calm, validated booking flow with your summary visible from start to finish.")}
      />
      <div className="mt-6">
        <BookingWizard
          initialDoctorId={doctorId}
          doctors={doctors}
          clinics={clinics}
          appointmentTypes={appointmentTypes}
          appointmentModeOptions={appointmentModeOptions}
        />
      </div>
    </div>
  );
}

export function AboutPageContent() {
  const { t } = useLocale();
  const pointKeys = ["communication", "clinicians", "facilities"] as const;

  return (
    <>
      <section className="marketing-section">
        <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <SectionIntro
            eyebrow={t("pages.about.eyebrow", "About MediEase")}
            title={t("pages.about.title", "MediEase Hospital - patient-centered care you can trust")}
            description={t(
              "pages.about.description",
              "We provide compassionate, coordinated care across specialties. Our teams focus on safety, clear communication, and practical support for patients and families.",
            )}
          />
          <Card className="space-y-4">
            <div className="relative h-40 rounded-2xl overflow-hidden">
              <Image src="/stock-images/1 (2).jpg" alt={t("pages.about.imageAlt", "Care team")} fill loading="eager" className="object-cover" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t("pages.about.cardTitle", "What matters to patients")}</p>
            <ul className="grid gap-3 text-sm leading-6 text-[var(--color-ink-700)] md:text-base">
              {pointKeys.map((key) => (
                <li key={key}>{t(`pages.about.points.${key}`)}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}

export function ContactPageContent() {
  const { t } = useLocale();

  return (
    <section className="marketing-section">
      <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <SectionIntro
          eyebrow={t("pages.contact.eyebrow", "Contact")}
          title={t("pages.contact.title", "Get in touch with our care team")}
          description={t("pages.contact.description", "Phone, email, and visiting information - here's how to reach us and when to come in.")}
        />
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t("pages.contact.mainContact", "Main contact")}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{siteConfig.supportEmail}</p>
            <p className="text-sm text-[var(--color-ink-600)]">{t("pages.contact.phoneLabel", "Phone")}: {siteConfig.phone}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t("pages.contact.addressHours", "Address & hours")}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{t("footer.address", siteConfig.address)}</p>
            <p className="text-sm text-[var(--color-ink-600)]">{t("footer.hoursLabel", "Hours")}: {t("footer.openingHours", siteConfig.openingHours)}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t("pages.contact.emergency", "Emergency")}</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-ink-950)]">{siteConfig.emergencyPhone}</p>
            <p className="text-sm text-[var(--color-ink-600)]">{t("pages.contact.emergencyText", "If this is a medical emergency, call your local emergency number immediately.")}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t("pages.contact.helpfulLinks", "Helpful links")}</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--color-ink-600)] md:text-base">
              <li>
                <Link href="/appointments" className="hover:underline">{t("pages.contact.links.appointments", "How to book an appointment")}</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">{t("pages.contact.links.faq", "Frequently asked questions")}</Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:underline">{t("pages.contact.links.accessibility", "Accessibility support")}</Link>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function AppointmentsPageContent() {
  const { t } = useLocale();
  const itemKeys = ["general", "specialist", "surgery", "modes"] as const;

  return (
    <section className="marketing-section">
      <div className="layout-container grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <SectionIntro
          eyebrow={t("pages.appointments.eyebrow", "Appointments")}
          title={t("pages.appointments.title", "Book care that fits your needs")}
          description={t("pages.appointments.description", "Information on appointment types, what to bring, and how to prepare for visits - with clear steps to book online or by phone.")}
        />

        <Card className="space-y-4">
          <div className="relative h-40 rounded-2xl overflow-hidden">
            <Image src="/stock-images/1 (1).jpg" alt={t("pages.appointments.imageAlt", "Patient room")} fill loading="eager" className="object-cover" />
          </div>
          <div className="grid gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
            <p className="font-semibold">{t("pages.appointments.cardTitle", "Appointment types")}</p>
            <ul className="list-disc pl-5">
              {itemKeys.map((key) => (
                <li key={key}>{t(`pages.appointments.items.${key}`)}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <LinkButton href="/patient/book">{t("pages.appointments.startBooking", "Start booking")}</LinkButton>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function FaqPageContent() {
  const { t } = useLocale();
  const itemKeys = ["demo", "access", "accessibility"] as const;

  return (
    <section className="marketing-section">
      <div className="layout-reading space-y-8">
        <SectionIntro
          eyebrow={t("pages.faq.eyebrow", "Frequently asked questions")}
          title={t("pages.faq.title", "Clear answers for product, implementation, and accessibility considerations")}
          description={t("pages.faq.description", "MediEase is meant to be inspected, extended, and adapted responsibly. These answers cover the most common architectural questions.")}
          align="center"
        />
        <div className="grid gap-4">
          {itemKeys.map((key) => (
            <Card key={key} className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">{t(`pages.faq.items.${key}.question`)}</h2>
              <p className="text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{t(`pages.faq.items.${key}.answer`)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ForPatientsPageContent() {
  const { t } = useLocale();
  const benefitKeys = ["search", "booking", "manage"] as const;

  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <SectionIntro
          eyebrow={t("pages.forPatients.eyebrow", "For patients")}
          title={t("pages.forPatients.title", "Book, prepare, and manage care with less friction")}
          description={t("pages.forPatients.description", "The patient experience centers on clarity. Each page is designed to reduce uncertainty, not add more work during already stressful healthcare moments.")}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {benefitKeys.map((key) => (
            <Card key={key}>
              <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">{t(`pages.forPatients.benefits.${key}`)}</p>
            </Card>
          ))}
        </div>
        <LinkButton href="/sign-up" size="sm">{t("auth.createPatientAccount", "Create a patient account")}</LinkButton>
      </div>
    </section>
  );
}

export function ForDoctorsPageContent() {
  const { t } = useLocale();
  const areaKeys = ["doctor", "staff", "admin"] as const;

  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <div className="relative rounded-2xl overflow-hidden h-56 md:h-72">
          <Image src="/stock-images/1 (4).jpg" alt={t("pages.forDoctors.imageAlt", "Surgeon")} fill loading="eager" className="object-cover" />
        </div>
        <SectionIntro
          eyebrow={t("pages.forDoctors.eyebrow", "For clinics")}
          title={t("pages.forDoctors.title", "Operational views designed for clinicians, front desks, and administrators")}
          description={t("pages.forDoctors.description", "MediEase keeps each role focused on what matters while preserving the cross-team visibility needed to coordinate care smoothly.")}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {areaKeys.map((key) => (
            <Card key={key} className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">{t(`pages.forDoctors.areas.${key}.title`)}</h2>
              <p className="text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{t(`pages.forDoctors.areas.${key}.description`)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PrivacyPageContent() {
  const { t } = useLocale();
  const topicKeys = ["serviceKeys", "access", "rls"] as const;

  return (
    <section className="marketing-section">
      <div className="layout-reading space-y-8">
        <SectionIntro
          eyebrow={t("pages.privacy.eyebrow", "Privacy and security")}
          title={t("pages.privacy.title", "A product foundation that keeps security and access boundaries in view")}
          description={t("pages.privacy.description", "This codebase is structured to evolve into production deployment with Supabase auth, row-level security, and controlled role access.")}
        />
        <div className="grid gap-4">
          {topicKeys.map((key) => (
            <Card key={key}>
              <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">{t(`pages.privacy.topics.${key}`)}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingPageContent() {
  const { t } = useLocale();
  const tiers = [
    { key: "starter", featureKeys: ["trial", "booking", "access"] },
    { key: "clinic", featureKeys: ["auth", "scheduling", "dashboards"] },
    { key: "network", featureKeys: ["admin", "reporting", "integrations"] },
  ] as const;

  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <SectionIntro
          eyebrow={t("pages.pricing.eyebrow", "Pricing")}
          title={t("pages.pricing.title", "Simple tiers for pilots, clinics, and healthcare networks")}
          description={t("pages.pricing.description", "Contact us for pricing and deployment options tailored to your clinic or network.")}
          align="center"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.key} className={tier.key === "clinic" ? "border-[var(--color-brand-300)]" : "h-full"}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">{t(`pages.pricing.tiers.${tier.key}.name`)}</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink-950)]">{t(`pages.pricing.tiers.${tier.key}.price`)}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{t(`pages.pricing.tiers.${tier.key}.audience`)}</p>
              <ul className="mt-5 grid gap-2.5 text-sm leading-6 text-[var(--color-ink-700)]">
                {tier.featureKeys.map((feature) => (
                  <li key={feature}>{t(`pages.pricing.tiers.${tier.key}.features.${feature}`)}</li>
                ))}
              </ul>
              <div className="mt-6">
                <LinkButton href="/contact" variant={tier.key === "clinic" ? "primary" : "outline"} size="sm">
                  {t("pages.pricing.talkToMediEase", "Talk to MediEase")}
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
