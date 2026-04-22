import { buildMetadata } from "@/lib/constants/site";
import { ForPatientsPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "For Patients",
  description: "See how patients search doctors, book appointments, manage reminders, and update accessibility preferences in MediEase.",
});

export default function ForPatientsPage() {
  return <ForPatientsPageContent />;
}
