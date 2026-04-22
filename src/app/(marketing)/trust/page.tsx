import { buildMetadata } from "@/lib/constants/site";
import { TrustSection, CallToActionBanner } from "@/features/marketing/sections";

export const metadata = buildMetadata({
  title: "Trust",
  description: "Review the operational trust, auth architecture, and accessibility posture behind MediEase.",
});

export default function TrustPage() {
  return (
    <>
      <TrustSection />
      <CallToActionBanner />
    </>
  );
}
