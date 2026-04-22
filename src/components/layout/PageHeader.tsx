import type { BreadcrumbItem } from "@/types/common";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function PageHeader({
  title,
  description,
  breadcrumbItems,
  actions,
  maxWidthClass,
}: {
  title: string;
  description: string;
  breadcrumbItems?: BreadcrumbItem[];
  actions?: React.ReactNode;
  // Optional Tailwind max-width class to control title width. Defaults to 'max-w-3xl'.
  maxWidthClass?: string;
}) {
  return (
    <header className="grid gap-2">
      {breadcrumbItems ? <Breadcrumbs items={breadcrumbItems} /> : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className={`${maxWidthClass ?? "max-w-3xl"} space-y-2`}>
          <h1 className="text-3xl font-semibold leading-[1.05] text-[var(--color-ink-950)] md:text-[2.35rem]">{title}</h1>
          <p className="max-w-2xl text-[15px] leading-7 text-[var(--color-ink-600)]">{description}</p>
        </div>
        {actions}
      </div>
    </header>
  );
}
