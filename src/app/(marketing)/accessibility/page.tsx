import { buildMetadata } from "@/lib/constants/site";
import { AccessibilitySection, CallToActionBanner } from "@/features/marketing/sections";

export const metadata = buildMetadata({
  title: "Accessibility",
  description: "Review how MediEase supports readable, keyboard-navigable, reduced-motion healthcare experiences.",
});

export default function AccessibilityPage() {
  return (
    <>
      <AccessibilitySection />
      <CallToActionBanner />
    </>
  );
}
