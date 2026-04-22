type Translator = (key: string, fallback?: string) => string;

function toCamelKey(value: string) {
  const words = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

function toPlainKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function localizeLanguage(t: Translator, language: string) {
  return t(`languages.${toPlainKey(language)}`, language);
}

export function localizeSpecialty(t: Translator, specialty: string) {
  return t(`specialties.${toCamelKey(specialty)}`, specialty);
}

export function localizeDoctorBio(t: Translator, bio?: string | null) {
  if (!bio) return "";
  if (bio === "Profile details will be added soon.") {
    return t("doctors.profileDetailsSoon", bio);
  }
  return bio;
}
