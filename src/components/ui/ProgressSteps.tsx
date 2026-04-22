import { cn } from "@/lib/utils/cn";

type ProgressStepsProps = {
  currentStep: number;
  steps: string[];
};

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-5" aria-label="Booking progress">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <li
            key={step}
            className={cn(
              "rounded-[var(--radius-panel)] border p-4 text-sm",
              isCurrent
                ? "border-[var(--color-brand-500)] bg-[var(--color-brand-50)]"
                : isComplete
                  ? "border-[var(--color-success-200)] bg-[var(--color-success-100)]"
                  : "border-[var(--color-panel-border)] bg-white",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-900)]">
              Step {stepNumber}
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-ink-600)]">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
