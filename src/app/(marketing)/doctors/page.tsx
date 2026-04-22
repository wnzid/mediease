import { buildMetadata } from "@/lib/constants/site";
import DoctorsPageContent from "@/components/doctors/DoctorsPageContent";

export const metadata = buildMetadata({
  title: "Doctors",
  description: "Meet our medical staff and care teams at MediEase Hospital.",
});

export default async function DoctorsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DoctorsPageContent searchParams={searchParams} isPatient={false} />;
}
