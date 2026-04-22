import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type LogoVariant = "landscape" | "square" | "full" | "icon";
type SizeKey = "sm" | "md" | "lg" | "xl";

export function Logo({
  variant = "full",
  size = "md",
  className,
  alt = "MediEase",
  priority = false,
}: {
  variant?: LogoVariant;
  size?: SizeKey | number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const fullSrc = "/branding/landscape-logo.svg";
  const iconSrc = "/branding/logo.svg";

  const sizeMap: Record<SizeKey, number> = { sm: 34, md: 60, lg: 200, xl: 58 };
  const heightPx = typeof size === "number" ? size : sizeMap[size || "md"];

  const isSquare = variant === "icon" || variant === "square";
  const landscapeRatio = 192 / 40;
  const widthPx = isSquare ? heightPx : Math.round(heightPx * landscapeRatio);

  const src = isSquare ? iconSrc : fullSrc;

  return (
    <Image
      src={src}
      alt={alt}
      width={widthPx}
      height={heightPx}
      priority={priority}
      loading="eager"
      sizes={isSquare ? `${heightPx}px` : `${widthPx}px`}
      style={{ height: `${heightPx}px`, width: "auto" }}
      className={cn("inline-block shrink-0 object-contain max-w-none", className)}
    />
  );
}
