import type { Doctor } from "@/types/doctors";
import type { Clinic } from "@/types/clinics";

export type DoctorSearchFilters = {
  query?: string;
  specialty?: string;
  clinic?: string;
  language?: string;
  mode?: string;
};

export function filterDoctors(doctors: Doctor[], clinics: Clinic[], filters: DoctorSearchFilters) {
  return doctors.filter((doctor) => matchesDoctor(doctor, clinics, filters));
}


function matchesDoctor(doctor: Doctor, clinics: Clinic[], filters: DoctorSearchFilters) {
  const query = filters.query?.toLowerCase().trim();
  const specialty = filters.specialty?.trim();
  const clinic = filters.clinic?.trim();
  const language = filters.language?.trim();
  const mode = filters.mode?.trim();

  if (query && !`${doctor.fullName} ${doctor.specialty} ${doctor.bio}`.toLowerCase().includes(query)) {
    return false;
  }

  if (specialty && specialty !== "all" && doctor.specialty !== specialty) {
    return false;
  }

  if (clinic && clinic !== "all") {
    const clinicId = clinics.find((item) => item.slug === clinic)?.id;
    if (!clinicId || !doctor.clinicIds.includes(clinicId)) {
      return false;
    }
  }

  if (language && language !== "all" && !doctor.languages.includes(language)) {
    return false;
  }

  if (mode === "telehealth" && !doctor.acceptsTelehealth) {
    return false;
  }

  return true;
}
