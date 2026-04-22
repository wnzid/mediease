import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

export function SectionIconBadge({ name, size = "md", className }: { name: string; size?: "sm" | "md"; className?: string }) {
  const sizeClasses: Record<string, string> = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
  };

  return (
    <div className={cn("inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium", sizeClasses[size], "bg-[var(--color-panel-muted)] text-[var(--color-brand-600)]", className)}>
      <Icon name={name} className={size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]"} aria-hidden />
    </div>
  );
}
