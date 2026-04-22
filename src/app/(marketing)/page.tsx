import { HeroSection, ServicesSection, DigitalFeaturesSection, CareTeamsSection, TrustSection } from "@/features/marketing/sections";
import { getSessionContext } from "@/lib/auth/session";

export default async function HomePage() {
  const session = await getSessionContext();

  return (
    <>
      <HeroSection isAuthenticated={session.isAuthenticated} role={session.role} />
      <ServicesSection />
      <DigitalFeaturesSection />
      <CareTeamsSection />
      <TrustSection />
    </>
  );
}
