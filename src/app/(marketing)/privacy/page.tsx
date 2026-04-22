import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "Understand the MediEase privacy posture and Supabase deployment notes.",
});

const privacyTopics = [
  "Service role keys are intentionally excluded from client code and are never exposed in the browser.",
  "Role access is guarded in middleware and checked again on the server for protected sections.",
  "Supabase RLS policies are documented separately so profile, appointment, and notification access can remain principle-driven.",
];

export default function PrivacyPage() {
  return (
    <section className="marketing-section">
      <div className="layout-reading space-y-8">
        <SectionIntro
          eyebrow="Privacy and security"
          title="A product foundation that keeps security and access boundaries in view"
          description="This codebase is structured to evolve into production deployment with Supabase auth, row-level security, and controlled role access."
        />
        <div className="grid gap-4">
          {privacyTopics.map((topic) => (
            <Card key={topic}>
              <p className="text-sm leading-6 text-[var(--color-ink-700)] md:text-base">{topic}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
