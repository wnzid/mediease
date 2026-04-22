import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { getDoctors, getDoctorBySlug, getClinics, getDoctorAvailability } from "@/lib/data/supabase";
import { getDictionary, t as serverT } from "@/lib/i18n/server";
import { localizeDoctorBio, localizeLanguage, localizeSpecialty } from "@/lib/i18n/labels";

async function AvailabilityList({ doctorId, dict }: { doctorId: string; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  let avails: Awaited<ReturnType<typeof getDoctorAvailability>>;
  try {
    const today = new Date().toISOString().slice(0, 10);
    avails = await getDoctorAvailability(doctorId, today);
  } catch {
    return <p className="text-sm text-[var(--color-ink-600)]">{serverT(dict, "doctors.unableToLoadAvailability", "Unable to load availability.")}</p>;
  }

  if (!avails || avails.length === 0) {
    return <p className="text-sm text-[var(--color-ink-600)]">{serverT(dict, "doctors.noUpcomingAvailability", "No upcoming availability. Click Book appointment to request a visit.")}</p>;
  }

  const items = avails.slice(0, 3).map((availability) => (
    <li key={availability.id} className="text-sm text-[var(--color-ink-700)]">
      {availability.availabilityDate} · {availability.startTime} - {availability.endTime} · {availability.slotDurationMinutes}m · {serverT(dict, `patient.appointmentCard.modeNames.${availability.appointmentMode}`, availability.appointmentMode)}
    </li>
  ));

  return <ul className="list-inside list-disc mt-2">{items}</ul>;
}

export default async function DoctorDetailContent({ params, isPatient = false }: { params: Promise<{ id: string }>; isPatient?: boolean }) {
  const { id } = await params;
  const doctor = await getDoctorBySlug(id);

  if (!doctor) notFound();

  const allDoctors = await getDoctors();
  const clinics = await getClinics();
  const dict = await getDictionary();
  const translate = (key: string, fallback?: string) => serverT(dict, key, fallback);
  const relatedDoctors = allDoctors.filter((item) => item.id !== doctor.id).slice(0, 2);
  const associatedClinics = clinics.filter((clinic) => doctor.clinicIds.includes(clinic.id));

  const bookHref = isPatient ? `/patient/book?doctor=${doctor.id}` : `/book?doctor=${doctor.id}`;
  const profileBase = isPatient ? "/patient/doctors" : "/doctors";
  const specialty = localizeSpecialty(translate, doctor.specialty);
  const subSpecialty = doctor.subSpecialty ? localizeSpecialty(translate, doctor.subSpecialty) : "";
  const bio = localizeDoctorBio(translate, doctor.bio);
  const localizedLanguages = doctor.languages.map((language) => localizeLanguage(translate, language)).join(", ");

  return (
    <>
      <PageHeader
        title={doctor.fullName}
        description={`${specialty}${subSpecialty ? ` · ${subSpecialty}` : ""}`}
        actions={<LinkButton href={bookHref}>{serverT(dict, "doctors.bookAppointment", "Book appointment")}</LinkButton>}
      />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5">
          <Card>
            <div className="flex flex-col gap-5 md:flex-row">
              <Avatar name={doctor.fullName} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[var(--color-brand-50)] text-[var(--color-brand-700)]">{specialty}</Badge>
                  {doctor.acceptsTelehealth ? <Badge className="bg-[var(--color-panel-muted)] text-[var(--color-ink-700)]">{serverT(dict, "doctors.find.telehealth", "Telehealth")}</Badge> : null}
                </div>
                {bio ? <p className="mt-4 text-base leading-8 text-[var(--color-ink-700)]">{bio}</p> : null}
                {doctor.careApproach ? <p className="mt-4 text-base leading-8 text-[var(--color-ink-700)]">{doctor.careApproach}</p> : null}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{serverT(dict, "doctors.availabilityPreview", "Availability preview")}</h2>
            <div className="mt-3 text-base text-[var(--color-ink-700)]">
              <AvailabilityList doctorId={doctor.id} dict={dict} />
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{serverT(dict, "doctors.reviewsPlaceholder", "Reviews placeholder")}</h2>
            <p className="mt-3 text-base leading-7 text-[var(--color-ink-600)]">
              {serverT(dict, "doctors.reviewsPlaceholderDescription", "Production review aggregation can be connected later. For now, the profile keeps the structure ready without inventing fake patient detail.")}
            </p>
          </Card>
        </div>
        <div className="grid gap-5">
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{serverT(dict, "doctors.details", "Details")}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--color-ink-700)]">
              <p>{serverT(dict, "doctors.languagesLabel", "Languages")}: {localizedLanguages}</p>
              <p>{serverT(dict, "doctors.experienceLabel", "Experience")}: {doctor.yearsExperience} {serverT(dict, "doctors.yearsLabel", "years")}</p>
              <p>{serverT(dict, "doctors.insuranceLabel", "Insurance")}: {doctor.insuranceAccepted.join(", ")}</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{serverT(dict, "doctors.clinics", "Clinics")}</h2>
            <div className="mt-4 grid gap-4">
              {associatedClinics.map((clinic) => (
                <div key={clinic.id} className="rounded-[1.25rem] border border-[var(--color-panel-border)] p-4">
                  <p className="font-semibold text-[var(--color-ink-950)]">{clinic.name}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--color-ink-600)]">{clinic.address}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--color-ink-950)]">{serverT(dict, "doctors.relatedDoctors", "Related doctors")}</h2>
            <div className="mt-4 grid gap-4">
              {relatedDoctors.map((item) => (
                <LinkButton key={item.id} href={`${profileBase}/${item.slug}`} variant="outline">
                  {item.fullName}
                </LinkButton>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
