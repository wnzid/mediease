import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { BreadcrumbItem } from "@/types/common";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--color-ink-600)]">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? <Icon name="chevron_right" className="text-base" aria-hidden /> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-ink-900)]">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[var(--color-ink-900)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
