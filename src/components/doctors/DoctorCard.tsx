"use client";

"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/useLocale";
import { Card } from "@/components/ui/Card";
import type { Doctor } from "@/types/doctors";

export function DoctorCard({
  doctor,
  compact = false,
  showLinks = true,
  primaryClinicName,
  profileBase,
  bookBase,
}: {
  doctor: Doctor;
  compact?: boolean;
  showLinks?: boolean;
  primaryClinicName?: string | null;
  profileBase?: string | null;
  bookBase?: string | null;
}) {
  const { t } = useLocale();

  const parts: string[] = [];
  if (doctor.yearsExperience && doctor.yearsExperience > 0) parts.push(`${doctor.yearsExperience} ${t("doctors.yearsExperienceSuffix")}`);
  const langs = (doctor.languages ?? []).join(", ");
  if (langs) parts.push(langs);
  if ((doctor.reviewCount ?? 0) > 0 && typeof doctor.rating === "number") parts.push(`${doctor.rating.toFixed(1)} / 5`);
  if (primaryClinicName) parts.push(primaryClinicName);

  return (
    <Card className={`${compact ? "p-2" : "p-3"} transition-shadow hover:shadow-[var(--shadow-panel)]`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Avatar name={doctor.fullName} size={compact ? "md" : "lg"} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {showLinks ? (
                <Link href={`${profileBase ?? "/patient/doctors"}/${doctor.slug}`} className="block text-lg font-semibold leading-tight text-[var(--color-ink-950)] truncate">
                  {doctor.fullName}
                </Link>
              ) : (
                <p className="text-lg font-semibold leading-tight text-[var(--color-ink-950)] truncate">{doctor.fullName}</p>
              )}

              <p className="mt-1 text-sm text-[var(--color-ink-600)]">{doctor.specialty}{doctor.subSpecialty ? ` · ${doctor.subSpecialty}` : ""}</p>

              <p className="mt-2 text-xs text-[var(--color-ink-600)]">{parts.join(" · ")}</p>

              {!compact ? <p className="mt-2 text-sm text-[var(--color-ink-700)] max-h-12 overflow-hidden">{doctor.bio}</p> : null}
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-2">
              {doctor.acceptsTelehealth ? (
                <Badge className="bg-[var(--color-brand-50)] text-[var(--color-brand-700)] text-xs py-1 px-2">{t("doctors.telehealthAvailable")}</Badge>
              ) : (
                <div className="h-6" />
              )}

              {showLinks ? (
                <div className="mt-2 flex flex-col items-end gap-2">
                  <LinkButton href={`${profileBase ?? "/patient/doctors"}/${doctor.slug}`} variant="outline" size="sm">
                    {t("doctors.viewProfile")}
                  </LinkButton>
                  <LinkButton href={`${bookBase ?? "/patient/book"}?doctor=${doctor.id}`} size="sm">
                    {t("common.bookAppointment")}
                  </LinkButton>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
