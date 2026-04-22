"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button, LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/layout/Logo";
import { marketingNavigation, roleHomePaths } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/constants/site";
import { useLocale } from "@/lib/i18n/useLocale";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function HeroSection({ isAuthenticated, role }: { isAuthenticated?: boolean; role?: string }) {
  const primaryHref = isAuthenticated ? "/patient/book" : "/book";
  const portalHref = isAuthenticated
    ? role
      ? roleHomePaths[(role as keyof typeof roleHomePaths)] ?? "/patient/dashboard"
      : "/patient/dashboard"
    : "/sign-in";
  const { t } = useLocale();

  return (
    <section className="hero-grid border-b border-[var(--color-panel-border)]">
      <div className="layout-container grid gap-8 py-[clamp(3rem,6vw,4.5rem)] lg:grid-cols-2 lg:items-center">
        <div className="max-w-3xl space-y-4">
          <h1 className="font-serif text-4xl leading-tight text-[var(--color-ink-950)] md:text-5xl xl:text-[3.25rem]">
            {t("header.heroTitle")}
          </h1>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={primaryHref} size="lg">{t("common.bookAppointment")}</LinkButton>
            <LinkButton href={portalHref} variant="outline" size="lg">{t("common.patientPortal")}</LinkButton>
          </div>
        </div>

        <div className="order-first lg:order-last">
          <div className="relative h-64 sm:h-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-sm">
            <Image
              src="/stock-images/1 (2).jpg"
              alt={t("header.heroTitle") || "Care team"}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const { t } = useLocale();

  const services = [
    ["services.generalConsultation", "services.items.generalConsultationDesc"],
    ["services.emergencyCare", "services.items.emergencyCareDesc"],
    ["services.surgicalServices", "services.items.surgicalServicesDesc"],
    ["services.diagnosticImaging", "services.items.diagnosticImagingDesc"],
    ["services.inpatientCare", "services.items.inpatientCareDesc"],
    ["services.preventiveCare", "services.list.sameDay"],
  ];

  return (
    <section className="marketing-section--compact">
      <div className="layout-container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="grid gap-4">
          {services.map(([titleKey, descriptionKey]) => (
            <Card key={titleKey} className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--color-ink-900)]">{t(titleKey)}</h3>
              <p className="text-sm leading-6 text-[var(--color-ink-700)]">{t(descriptionKey)}</p>
            </Card>
          ))}
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm md:h-96">
          <Image src="/stock-images/1 (3).jpg" alt={t("services.heroTitle") || "Clinical services"} fill loading="eager" className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
        </div>
      </div>
    </section>
  );
}

export function AccessibilitySection() {
  const { t } = useLocale();
  const commitments = [
    {
      icon: "keyboard",
      title: t("marketing.accessibility.commitments.keyboard.title"),
      description: t("marketing.accessibility.commitments.keyboard.description"),
    },
    {
      icon: "text_fields",
      title: t("marketing.accessibility.commitments.readable.title"),
      description: t("marketing.accessibility.commitments.readable.description"),
    },
    {
      icon: "motion_photos_off",
      title: t("marketing.accessibility.commitments.motion.title"),
      description: t("marketing.accessibility.commitments.motion.description"),
    },
    {
      icon: "translate",
      title: t("marketing.accessibility.commitments.language.title"),
      description: t("marketing.accessibility.commitments.language.description"),
    },
  ];

  return (
    <section className="marketing-section">
      <div className="layout-container grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="max-w-xl space-y-3">
          <h2 className="text-3xl font-semibold text-[var(--color-ink-900)]">{t("marketing.accessibility.title")}</h2>
          <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">{t("marketing.accessibility.lead")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {commitments.map((commitment) => (
            <Card key={commitment.title} className="space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] text-[var(--color-brand-700)]">
                <Icon name={commitment.icon} className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{commitment.title}</h2>
                <p className="text-sm leading-6 text-[var(--color-ink-600)]">{commitment.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DigitalFeaturesSection() {
  const { t } = useLocale();
  const features = [
    ["marketing.digital.features.ePrescribing.title", "marketing.digital.features.ePrescribing.description"],
    ["marketing.digital.features.labIntegrations.title", "marketing.digital.features.labIntegrations.description"],
    ["marketing.digital.features.accessControls.title", "marketing.digital.features.accessControls.description"],
  ];

  return (
    <section className="marketing-section--compact border-t border-[var(--color-panel-border)]">
      <div className="layout-container grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("marketing.digital.title")}</h2>
          <p className="text-sm leading-6 text-[var(--color-ink-700)]">{t("marketing.digital.lead")}</p>
          <div className="grid gap-4 md:grid-cols-2 mt-3">
            {features.map(([titleKey, descriptionKey]) => (
              <Card key={titleKey} className="space-y-3">
                <h3 className="text-sm font-semibold text-[var(--color-ink-900)]">{t(titleKey)}</h3>
                <p className="text-sm leading-6 text-[var(--color-ink-700)]">{t(descriptionKey)}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm md:h-96">
          <Image src="/stock-images/1 (6).jpg" alt="Bedside monitor" fill loading="eager" className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
        </div>
      </div>
    </section>
  );
}

export function CareTeamsSection() {
  return (
    <section className="marketing-section--compact"> 
    </section>
  );
}

export function ContactSection() {
  const { t } = useLocale();
  return (
    <section className="marketing-section--compact">
      <div className="layout-container max-w-5xl">
        {/* localized via t() */}
        <h3 className="text-lg font-semibold text-[var(--color-ink-900)]">{t("marketing.contact.title")}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">{t("marketing.contact.desc")}</p>
      </div>
    </section>
  );
}

export function TrustSection() {
  const trustItems = [
    ["Security", "Encrypted data at rest and in transit with audit logs and compliance support."],
    ["Reliability", "High-availability architecture and regional deployments for hospitals."],
    ["Support", "Dedicated support and onboarding for clinical teams and administrators."],
  ];

  return (
    <section className="marketing-section--compact border-t border-[var(--color-panel-border)]">
    </section>
  );
}

export function CallToActionBanner() {
  const { t } = useLocale();

  return (
    <section className="marketing-section--compact">
      <div className="layout-container">
        <div className="flex flex-col gap-4 rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[var(--color-ink-900)]">{t("marketing.cta.title")}</h3>
            <p className="text-sm leading-6 text-[var(--color-ink-700)]">{t("marketing.cta.desc")}</p>
          </div>
          <div className="flex gap-2">
            <LinkButton href="/book" size="sm">{t("common.bookAppointment")}</LinkButton>
            <LinkButton href="/contact" variant="outline" size="sm">{t("nav.contact")}</LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketingHeader({ isAuthenticated, role }: { isAuthenticated?: boolean; role?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

    const { t } = useLocale();

    const navigation = (
    <>
      {marketingNavigation.map((item) => {
        const linkHref = (() => {
          if (item.href === "/doctors") return isAuthenticated ? "/patient/doctors" : "/doctors";
          if (item.href === "/appointments") return isAuthenticated ? "/patient/book" : "/book";
          return item.href;
        })();
        const active = pathname === item.href || pathname === linkHref;

        return (
          <Link
            key={item.href}
            href={linkHref}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                : "text-[var(--color-ink-700)] hover:bg-[var(--color-panel-muted)] hover:text-[var(--color-ink-950)]",
            )}
          >
                {t(item.labelKey ?? item.title)}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-[var(--color-panel-border)] bg-white/92 backdrop-blur-xl"
      >
        <div className="layout-container flex h-[var(--layout-header-height)] items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center">
            <span className="lg:hidden inline-flex items-center">
              <Logo variant="icon" size="md" priority />
            </span>
            <span className="hidden lg:inline-flex items-center">
              <Logo variant="landscape" size="lg" priority />
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">{navigation}</nav>

          <div className="hidden items-center gap-3 lg:flex">
              <LanguageSwitcher />
              <LinkButton
                href={isAuthenticated ? (role ? roleHomePaths[(role as keyof typeof roleHomePaths)] ?? "/patient/dashboard" : "/patient/dashboard") : "/sign-in"}
                variant="ghost"
                size="sm"
              >
                {t("common.patientPortal")}
              </LinkButton>
              <LinkButton href={isAuthenticated ? "/patient/book" : "/book"} size="sm">
                {t("common.bookAppointment")}
              </LinkButton>
          </div>

          <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={() => setOpen(true)}>
            <Icon name="menu" className="h-[18px] w-[18px]" aria-hidden />
            <span className="sr-only">{t("common.openNavigation")}</span>
          </Button>
        </div>
      </motion.header>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <div className="grid gap-5">
          <div className="flex items-center justify-end">
            <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)}>
              <Icon name="close" className="h-[18px] w-[18px]" aria-hidden />
              <span className="sr-only">{t("common.closeNavigation")}</span>
            </Button>
          </div>
          <nav className="grid gap-2">{navigation}</nav>
          <div className="grid gap-2 pt-2">
            <LinkButton href="/book" size="sm" onClick={() => setOpen(false)}>{t("common.bookAppointment")}</LinkButton>
            {isAuthenticated ? (
              <LinkButton
                href={role ? roleHomePaths[(role as keyof typeof roleHomePaths)] ?? "/patient/dashboard" : "/patient/dashboard"}
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                {t("common.patientPortal")}
              </LinkButton>
            ) : (
              <LinkButton href="/sign-in" variant="outline" size="sm" onClick={() => setOpen(false)}>{t("common.patientPortal")}</LinkButton>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export function MarketingFooter() {
  const { t } = useLocale();
  const footerColumns = [
    {
      title: t("footer.columns.explore"),
      links: [
        { label: t("nav.about"), href: "/about" },
        { label: t("nav.doctors"), href: "/doctors" },
        { label: t("nav.services"), href: "/services" },
        { label: t("nav.appointments"), href: "/appointments" },
      ],
    },
    {
      title: t("footer.columns.patient"),
      links: [
        { label: t("common.patientPortal"), href: "/sign-in" },
        { label: t("nav.contact"), href: "/contact" },
        { label: t("nav.faq"), href: "/faq" },
        { label: t("common.accessibility") ?? t("common.accessibilityFallback") ?? "Accessibility", href: "/accessibility" },
      ],
    },
    {
      title: t("footer.columns.legal"),
      links: [
        { label: t("footer.privacy") ?? "Privacy Policy", href: "/privacy" },
        { label: t("footer.terms") ?? "Terms", href: "/terms" },
        { label: t("footer.billing") ?? "Billing & Insurance", href: "/billing" },
        { label: t("nav.contact"), href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--color-panel-border)] bg-[var(--color-surface-muted)]">
      <div className="layout-container grid gap-6 py-8 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-1 text-sm text-[var(--color-ink-700)]">
            <p>{siteConfig.supportEmail}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.address}</p>
            <p className="text-[var(--color-ink-600)]">Hours: {siteConfig.openingHours}</p>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-500)]">{column.title}</h2>
            <ul className="mt-2 grid gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--color-ink-700)] transition hover:text-[var(--color-brand-700)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-panel-border)]">
        <div className="layout-container flex flex-col gap-2 py-5 text-sm text-[var(--color-ink-600)] md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright", "Copyright 2026 MediEase. All rights reserved.")}</p>
          <p>{t("footer.developedBy", "Developed by WNZID")}</p>
        </div>
      </div>
    </footer>
  );
}

export function FeatureGrid() {
  const features = [
    {
      icon: "search",
      title: "Doctor discovery with useful filters",
      description: "Search by specialty, language, clinic, appointment mode, and availability without losing context.",
    },
    {
      icon: "route",
      title: "Guided booking flow",
      description: "A multi-step appointment wizard keeps choices simple, validated, and visible at every stage.",
    },
    {
      icon: "shield",
      title: "Role-based workspaces",
      description: "Patients, doctors, staff, and admins all land in focused dashboards instead of sharing cluttered views.",
    },
    {
      icon: "notifications_active",
      title: "Clear feedback and notifications",
      description: "Status badges, reminders, and next-step cues keep care coordination visible and understandable.",
    },
    {
      icon: "instant_mix",
      title: "Flexible operation modes",
      description: "Support telehealth, in-person visits, clinic associations, and schedule management from one platform.",
    },
    {
      icon: "accessibility_new",
      title: "Accessibility settings built in",
      description: "Text scaling, reduced motion, high contrast, and simplified interface options are first-class controls.",
    },
  ];

  return (
    <section className="marketing-section">
      <div className="layout-container space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-3xl font-semibold text-[var(--color-ink-900)]">
            A healthcare product foundation designed for calm, trustworthy decisions
          </h2>
          <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">
            MediEase balances premium product quality with plain-language workflows that feel reassuring instead of overwhelming.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="space-y-4">
              <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">
                <Icon name={feature.icon} className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{feature.title}</h2>
                <p className="text-sm leading-6 text-[var(--color-ink-600)]">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const { t } = useLocale();
  const steps = [
    {
      title: "Find the right specialist",
      description: "Use focused filters for specialty, language, clinic, availability, and appointment mode.",
    },
    {
      title: "Choose a time that fits",
      description: "The booking wizard shows available slots with appointment type and care mode before confirmation.",
    },
    {
      title: "Prepare with confidence",
      description: "Review reminders, visit reasons, accessibility settings, and appointment details in one clear flow.",
    },
  ];

  return (
    <section className="marketing-section bg-white">
      <div className="layout-container space-y-8">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-3xl font-semibold text-[var(--color-ink-900)]">
            From search to follow-up, every step stays visible and easy to understand
          </h2>
          <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">
            The platform reduces friction without hiding important decisions. Patients know what is happening, and teams know what needs attention.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand-700)]">Step {index + 1}</p>
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">{step.title}</h2>
              <p className="text-sm leading-6 text-[var(--color-ink-600)]">{step.description}</p>
            </Card>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/for-patients" variant="outline" size="sm">{t("marketing.cta.seePatientWorkflows")}</LinkButton>
          <LinkButton href="/for-doctors" variant="ghost" size="sm">{t("marketing.cta.exploreClinicOperations")}</LinkButton>
        </div>
      </div>
    </section>
  );
}
