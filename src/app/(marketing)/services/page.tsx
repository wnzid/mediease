import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import ServiceMediaGallery from "@/components/ServiceMediaGallery";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import en from "@/lib/i18n/dictionaries/en";
import lt from "@/lib/i18n/dictionaries/lt";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isSupportedLocale } from "@/lib/i18n/config";

export const metadata = buildMetadata({
  title: "Services",
  description: "Hospital services and departments at MediEase, including emergency, surgery, diagnostics, and inpatient care.",
});

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const DICT: Record<string, any> = { en, lt };
  const dict = DICT[locale] ?? DICT[DEFAULT_LOCALE];
  const t = (key: string, fallback?: string) => {
    const parts = key.split(".");
    let cur: any = dict;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p];
      else {
        // fallback to default language
        let dcur: any = en;
        for (const pp of parts) {
          if (dcur && typeof dcur === "object" && pp in dcur) dcur = dcur[pp];
          else {
            dcur = undefined;
            break;
          }
        }
        if (typeof dcur === "string") return dcur;
        return fallback ?? key;
      }
    }
    return typeof cur === "string" ? cur : fallback ?? key;
  };

  return (
    <>
      <section className="marketing-section">
        <div className="layout-container grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <SectionIntro
            eyebrow={t("nav.services")}
            title={t("services.heroTitle")}
            description={t("services.intro")}
          />

          <Card className="space-y-3">
            <div className="relative h-40 rounded-2xl overflow-hidden shadow-sm">
              <Image src="/stock-images/1 (3).jpg" alt="Clinical services" fill loading="eager" className="object-cover" />
            </div>

            <ul className="grid gap-2 text-sm leading-6 text-[var(--color-ink-700)]">
              <li>{t("services.list.sameDay")}</li>
              <li>{t("services.list.coordinatedReferrals")}</li>
              <li>{t("services.list.imagingAndLabs")}</li>
              <li>{t("services.list.surgicalCare")}</li>
              <li>{t("services.list.inpatientSupport")}</li>
            </ul>

            <div className="mt-3 text-sm text-[var(--color-ink-600)]">
              <div>{t("services.summaryShort")}</div>
            </div>

            <div className="mt-3">
              <LinkButton href="/book">{t("common.bookAppointment")}</LinkButton>
            </div>
          </Card>
        </div>
      </section>

      <section className="marketing-section--compact">
        <div className="layout-container">
          <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("services.coreTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">{t("services.coreDescription")}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: t("services.generalConsultation"),
                icon: "stethoscope",
                desc: t("services.items.generalConsultationDesc"),
              },
              {
                title: t("services.emergencyCare" ) ?? "Emergency Care",
                icon: "warning",
                desc: t("services.items.emergencyCareDesc"),
              },
              {
                title: t("services.surgicalServices") ?? "Surgical Services",
                icon: "building-2",
                desc: t("services.items.surgicalServicesDesc"),
              },
              {
                title: t("services.diagnosticImaging") ?? "Diagnostic Imaging",
                icon: "layout-grid",
                desc: t("services.items.diagnosticImagingDesc"),
              },
              {
                title: t("services.laboratoryTesting") ?? "Laboratory Testing",
                icon: "clipboard-list",
                desc: t("services.items.laboratoryTestingDesc"),
              },
              {
                title: t("services.inpatient") ?? "Inpatient Care",
                icon: "user-round",
                desc: t("services.items.inpatientCareDesc"),
              },
            ].map((service) => (
              <Card key={service.title} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-15 place-items-center rounded-[var(--radius-control)] text-[var(--color-brand-700)]">
                    <Icon name={service.icon} className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                      <h3 className="text-sm font-semibold text-[var(--color-ink-900)]">{service.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-ink-700)]">{service.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section--compact border-t border-[var(--color-panel-border)]">
        <div className="layout-container grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("services.diagnosticsTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">{t("services.diagnosticsDescription")}</p>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--color-ink-700)]">
              <li>Continuous patient monitoring and telemetry</li>
              <li>Imaging coordination: X‑ray, CT, MRI, ultrasound</li>
              <li>Rapid lab turnaround and integrated results</li>
              <li>Pre- and post-procedure observation and assessment</li>
            </ul>
            <div className="mt-3">
              <LinkButton href="/contact" variant="outline" size="sm">{t("services.contactDiagnostics")}</LinkButton>
            </div>
          </div>

          <ServiceMediaGallery
            images={[
              { src: "/stock-images/1 (5).jpg", alt: "Patient monitor" },
              { src: "/stock-images/1 (6).jpg", alt: "Bedside monitor" },
              { src: "/stock-images/1 (3).jpg", alt: "Clinical staff" },
            ]}
          />
        </div>
      </section>

      <section className="marketing-section--compact">
        <div className="layout-container grid gap-6 lg:grid-cols-2 lg:items-center">
          <ServiceMediaGallery
            images={[
              { src: "/stock-images/1 (7).jpg", alt: "Operating room" },
              { src: "/stock-images/1 (4).jpg", alt: "Clinician" },
              { src: "/stock-images/1 (6).jpg", alt: "Equipment" },
            ]}
          />

          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("services.surgicalTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">{t("services.surgicalDescription")}</p>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--color-ink-700)]">
              <li>Pre-procedure assessment and patient preparation</li>
              <li>Dedicated operating suites and perioperative teams</li>
              <li>Post-operative monitoring and tailored recovery plans</li>
            </ul>
            <div className="mt-3">
              <LinkButton href="/book">{t("common.bookAppointment")}</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section--compact border-t border-[var(--color-panel-border)]">
        <div className="layout-container grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("services.inpatientTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-700)]">{t("services.inpatientDescription")}</p>

          </div>

          <ServiceMediaGallery
              images={[
                { src: "/stock-images/1 (10).jpg", alt: "Nurse checking patient" },
                { src: "/stock-images/1 (1).jpg", alt: "Patient room" },
                { src: "/stock-images/1 (8).jpg", alt: "Rehab and recovery" },
              ]}
            />
        </div>
      </section>

      {/* 'How to access care' section removed per request */}

      <section className="marketing-section--compact border-t border-[var(--color-panel-border)]">
        <div className="layout-container max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--color-ink-900)]">{t("services.faqsTitle")}</h2>
          <div className="mt-3 grid gap-2">
            {[
              { q: t("services.faqs.q1.q"), a: t("services.faqs.q1.a") },
              { q: t("services.faqs.q2.q"), a: t("services.faqs.q2.a") },
              { q: t("services.faqs.q3.q"), a: t("services.faqs.q3.a") },
              { q: t("services.faqs.q4.q"), a: t("services.faqs.q4.a") },
            ].map((item) => (
              <details key={item.q} className="group rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-ink-900)]">{item.q}</summary>
                <div className="mt-2 text-sm text-[var(--color-ink-700)]">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
