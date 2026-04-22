import { buildMetadata } from "@/lib/constants/site";
import { PricingPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "Review simple platform tiers for patient access, clinics, and multi-site healthcare teams.",
});

export default function PricingPage() {
  return <PricingPageContent />;
}
