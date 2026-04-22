import { MarketingFooter, MarketingHeader } from "@/features/marketing/sections";
import { getSessionContext } from "@/lib/auth/session";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionContext();

  return (
    <div className="page-shell min-h-screen">
      <MarketingHeader isAuthenticated={session.isAuthenticated} role={session.role} />
      <main id="main-content">{children}</main>
      <MarketingFooter />
    </div>
  );
}