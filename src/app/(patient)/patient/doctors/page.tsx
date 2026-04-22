import DoctorsPageContent from "@/components/doctors/DoctorsPageContent";

export default async function PatientDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DoctorsPageContent searchParams={searchParams} isPatient={true} />;
}
