import { PageHeader } from "@/components/layout/PageHeader";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { getDoctors, getClinics } from "@/lib/data/supabase";
import { Button, LinkButton } from "@/components/ui/Button";
import { filterDoctors } from "@/features/doctors/filter-doctors";
import { getDictionary, t as serverT } from "@/lib/i18n/server";

export default async function DoctorsPageContent({
  searchParams,
  isPatient = false,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  isPatient?: boolean;
}) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : "";
  const specialty = typeof params.specialty === "string" ? params.specialty : "all";
  const clinic = typeof params.clinic === "string" ? params.clinic : "all";
  const language = typeof params.language === "string" ? params.language : "all";
  const mode = typeof params.mode === "string" ? params.mode : "all";

  const doctors = await getDoctors();
  const clinics = await getClinics();
  const specialties = Array.from(new Set(doctors.map((d) => d.specialty))).filter(Boolean) as string[];
  const results = filterDoctors(doctors, clinics, { query, specialty, clinic, language, mode });

  const profileBase = isPatient ? "/patient/doctors" : "/doctors";
  const bookBase = isPatient ? "/patient/book" : "/book";

  const dict = await getDictionary();

  return (
    <div className="layout-container">
      {
        <PageHeader
          title={serverT(dict, "doctors.find.title", "Find a doctor")}
          description={serverT(dict, "doctors.find.description", "Search by specialty, clinic, language, telehealth support, and broader care preferences.")}
          maxWidthClass="max-w-none"
        />
      }

      <section className="grid gap-6 pb-12">
        <form className="flex flex-wrap items-center gap-3 rounded-full px-2 py-1">
          <div className="flex-1 min-w-0 md:max-w-[30rem]">
            <SearchBar name="query" defaultValue={query} className="h-9 rounded-full pl-9 text-sm" />
          </div>

          <select name="specialty" defaultValue={specialty} className="h-9 rounded-full border border-[var(--color-panel-border)] px-2 text-sm">
            <option value="all">{serverT(dict, "doctors.find.allSpecialties", "All specialties")}</option>
            {specialties.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select name="clinic" defaultValue={clinic} className="h-9 rounded-full border border-[var(--color-panel-border)] px-2 text-sm min-w-[9rem]">
            <option value="all">{serverT(dict, "doctors.find.allClinics", "All clinics")}</option>
            {clinics.map((item) => (
              <option key={item.id} value={item.slug}>{item.name}</option>
            ))}
          </select>

          <select name="language" defaultValue={language} className="h-9 rounded-full border border-[var(--color-panel-border)] px-2 text-sm">
            <>
              <option value="all">{serverT(dict, "doctors.find.allLanguages", "All languages")}</option>
              <option value="English">{serverT(dict, "languages.English", "English")}</option>
              <option value="Spanish">{serverT(dict, "languages.Spanish", "Spanish")}</option>
              <option value="Hindi">{serverT(dict, "languages.Hindi", "Hindi")}</option>
              <option value="Arabic">{serverT(dict, "languages.Arabic", "Arabic")}</option>
            </>
          </select>

          <select name="mode" defaultValue={mode} className="h-9 rounded-full border border-[var(--color-panel-border)] px-2 text-sm">
            <option value="all">{serverT(dict, "doctors.find.anyMode", "Any mode")}</option>
            <option value="telehealth">{serverT(dict, "doctors.find.telehealth", "Telehealth")}</option>
          </select>

          <div className="w-full sm:w-auto sm:ml-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:pl-3 sm:border-l sm:border-[var(--color-panel-border)]">
            <Button type="submit" size="sm" className="w-full sm:w-auto" aria-label={serverT(dict, "doctors.find.searchAria", "Search doctors")}>
              {serverT(dict, "doctors.find.search", "Search")}
            </Button>
            <LinkButton href={profileBase} variant="ghost" size="sm" className="w-full sm:w-auto">
              {serverT(dict, "doctors.find.clearFilters", "Clear filters")}
            </LinkButton>
          </div>
        </form>

        {results.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {results.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} profileBase={profileBase} bookBase={bookBase} />
            ))}
          </div>
        ) : (
              <EmptyState
                icon="search"
                title={serverT(dict, "doctors.find.emptyTitle", "No doctors match those filters")}
                description={serverT(dict, "doctors.find.emptyDescription", "Try broadening the specialty, clinic, or language filters to see more options.")}
              />
        )}
      </section>
    </div>
  );
}
