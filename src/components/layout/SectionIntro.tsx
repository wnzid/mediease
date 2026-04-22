import { cn } from "@/lib/utils/cn";

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl space-y-2", align === "center" && "mx-auto text-center")}> 
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-700)]">{eyebrow}</p>
      ) : null}
      <h1 className="font-serif text-3xl leading-tight text-[var(--color-ink-950)] md:text-[2.75rem]">{title}</h1>
      <p className="text-base leading-7 text-[var(--color-ink-600)] md:text-lg">{description}</p>
    </div>
  );
}
