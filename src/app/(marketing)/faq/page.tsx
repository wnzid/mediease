import { buildMetadata } from "@/lib/constants/site";
import { SectionIntro } from "@/components/layout/SectionIntro";
import { Card } from "@/components/ui/Card";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Common questions about MediEase implementation, accessibility, and role-based product flows.",
});

const faqs = [
  {
    question: "Can MediEase run without a configured Supabase project?",
    answer: "Yes. Demo mode is built in so teams can review flows before wiring production credentials.",
  },
  {
    question: "How are role-based sections protected?",
    answer: "Middleware provides fast route checks while server-side layouts re-validate access before rendering protected areas.",
  },
  {
    question: "Does the platform account for accessibility settings?",
    answer: "Yes. Text size, contrast, reduced motion, and simplified interface controls are available as first-class preferences.",
  },
];

export default function FaqPage() {
  return (
    <section className="marketing-section">
      <div className="layout-reading space-y-8">
        <SectionIntro
          eyebrow="Frequently asked questions"
          title="Clear answers for product, implementation, and accessibility considerations"
          description="MediEase is meant to be inspected, extended, and adapted responsibly. These answers cover the most common architectural questions."
          align="center"
        />
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">{faq.question}</h2>
              <p className="text-sm leading-6 text-[var(--color-ink-600)] md:text-base">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
