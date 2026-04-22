import { cn } from "@/lib/utils/cn";

type ProgressStepsProps = {
  currentStep: number;
  steps: string[];
  onStepClick?: (stepNumber: number) => void;
};

export function ProgressSteps({ currentStep, steps, onStepClick }: ProgressStepsProps) {
  const total = steps.length;

  return (
    <div aria-hidden={false}>
      {/* Mobile condensed header */}
      <div className="block md:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-[var(--color-ink-900)]">{`Step ${currentStep} of ${total}`}</p>
          <p className="text-sm text-[var(--color-ink-600)] truncate max-w-[60%]">{steps[currentStep - 1]}</p>
        </div>
        <div className="mt-2 flex items-center gap-2" aria-hidden>
          {steps.map((_, i) => {
            const stepNumber = i + 1;
            const isComplete = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            return (
              <span
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  isComplete ? "bg-[var(--color-brand-500)]" : isCurrent ? "bg-[var(--color-brand-300)]" : "bg-[var(--color-panel-border)]",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop horizontal stepper */}
      <ol className="hidden md:flex items-center" role="list" aria-label="Booking progress">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const clickable = Boolean(onStepClick && isComplete);

          return (
            <li key={label} className="flex items-center">
              <div className="flex items-center">
                <button
                  type={clickable ? "button" : "button"}
                  onClick={() => clickable && onStepClick?.(stepNumber)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${stepNumber}: ${label}`}
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold outline-none",
                    isComplete
                      ? "bg-[var(--color-brand-500)] text-white"
                      : isCurrent
                      ? "border-2 border-[var(--color-brand-500)] bg-white text-[var(--color-brand-700)]"
                      : "border border-[var(--color-panel-border)] bg-white text-[var(--color-ink-600)]",
                    clickable ? "cursor-pointer hover:brightness-95" : "cursor-default",
                  )}
                >
                  {isComplete ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-xs">{stepNumber}</span>
                  )}
                </button>
                <div className="ml-3 hidden md:block">
                  <div className={cn("text-sm font-medium", isCurrent ? "text-[var(--color-ink-900)]" : "text-[var(--color-ink-600)]")}>{label}</div>
                </div>
              </div>

              {/* connector */}
              {index < steps.length - 1 ? (
                <div
                  aria-hidden
                  className={cn(
                    "h-px w-12 mx-3",
                    isComplete ? "bg-[var(--color-brand-500)]" : "bg-[var(--color-panel-border)]",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
