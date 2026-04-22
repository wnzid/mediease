import { buildMetadata } from "@/lib/constants/site";
import { ForDoctorsPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "For Doctors and Clinics",
  description: "Explore the doctor, clinic staff, and admin sides of MediEase scheduling and operational workflows.",
});

export default function ForDoctorsPage() {
  return <ForDoctorsPageContent />;
}
