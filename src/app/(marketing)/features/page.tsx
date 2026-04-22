import { buildMetadata } from "@/lib/constants/site";
import { FeatureGrid, CallToActionBanner } from "@/features/marketing/sections";

export const metadata = buildMetadata({
  title: "Features",
  description: "Explore patient booking, doctor discovery, dashboards, and accessibility features in MediEase.",
});

export default function FeaturesPage() {
  return (
    <>
      <FeatureGrid />
      <CallToActionBanner />
    </>
  );
}
