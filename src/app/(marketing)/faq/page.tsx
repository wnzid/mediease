import { buildMetadata } from "@/lib/constants/site";
import { FaqPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Common questions about MediEase implementation, accessibility, and role-based product flows.",
});

export default function FaqPage() {
  return <FaqPageContent />;
}
