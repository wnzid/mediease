import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

type AvatarProps = {
  name?: string;
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "initials" | "icon" | "image";
};

function initialsFromName(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part?.[0] ?? "")
    .join("")
    .toUpperCase();
}

export function Avatar({ name = "", src, alt, size = "md", className, variant = "initials" }: AvatarProps) {
  const initials = initialsFromName(name);

  const sizeClasses: Record<string, string> = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-sm",
  };

  const base = cn(
    "inline-flex items-center justify-center rounded-full border border-[var(--color-panel-border)] bg-[var(--color-panel-muted)] font-semibold shadow-none",
    sizeClasses[size],
    className,
  );

  // If an explicit image src is provided, render a flat image avatar.
  if (src && variant !== "icon") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? name} className={cn(base, "object-cover") as string} />
    );
  }

  // Choose a subtle flat background + readable text for initials or icon
  const contentClass = "bg-[var(--color-panel-muted)] text-[var(--color-ink-900)]";

  if (variant === "icon") {
    return (
      <div className={cn(base, contentClass)} aria-hidden>
        <Icon name="user-round" className="h-4 w-4" aria-hidden />
      </div>
    );
  }

  return (
    <div className={cn(base, contentClass)} aria-hidden>
      {initials || <Icon name="user-round" className="h-4 w-4" aria-hidden />}
    </div>
  );
}
