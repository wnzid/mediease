import { buildMetadata } from "@/lib/constants/site";
import { CallToActionBanner } from "@/features/marketing/sections";
import { AboutPageContent } from "@/features/marketing/LocalizedPages";

export const metadata = buildMetadata({
  title: "About",
  description: "Learn about MediEase Hospital - our mission, care approach, and facilities.",
});

export default function AboutPage() {
  return (
    <>
      <AboutPageContent />
      <CallToActionBanner />
    </>
  );
}
