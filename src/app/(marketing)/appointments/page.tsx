import { buildMetadata } from "@/lib/constants/site";
import { AppointmentsPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "Appointments",
  description: "Learn how to book appointments, visit types, and what to expect at your visit.",
});

export default function AppointmentsPage() {
  return <AppointmentsPageContent />;
}
