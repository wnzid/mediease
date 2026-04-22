import { buildMetadata } from "@/lib/constants/site";
import { PrivacyPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "Understand the MediEase privacy posture and Supabase deployment notes.",
});

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
