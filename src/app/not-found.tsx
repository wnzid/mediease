import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-screen place-items-center px-4 py-12">
      <Card className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">Page not found</p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink-950)]">The care page you were looking for is not here.</h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-ink-600)]">
          Try heading back to the home page or return to your dashboard if you were already signed in.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/">Go home</LinkButton>
          <LinkButton href="/sign-in" variant="outline">
            Sign in
          </LinkButton>
        </div>
      </Card>
    </main>
  );
}
