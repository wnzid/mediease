import { buildMetadata } from "@/lib/constants/site";
import { ContactPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact MediEase Hospital for appointments, directions, and urgent information.",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
