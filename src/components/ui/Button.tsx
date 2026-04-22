"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useLocale } from "@/lib/i18n/useLocale";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui/Icon";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon-sm" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--color-brand-600)] text-white shadow-[0_1px_2px_rgba(16,34,40,0.14)] hover:bg-[var(--color-brand-700)]",
  secondary:
    "border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] text-[var(--color-brand-700)] hover:bg-[var(--color-brand-100)]",
  ghost:
    "bg-transparent text-[var(--color-ink-800)] hover:bg-[var(--color-panel-muted)]",
  outline:
    "border border-[var(--color-panel-border)] bg-white text-[var(--color-ink-900)] hover:border-[var(--color-brand-300)] hover:bg-[var(--color-surface-muted)]",
  danger: "bg-[var(--color-danger-600)] text-white hover:bg-[var(--color-danger-700)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-[var(--size-control-sm)] px-3.5 text-sm",
  md: "h-[var(--size-control)] px-4.5 text-sm",
  lg: "h-[var(--size-control-lg)] px-5.5 text-sm",
  "icon-sm": "h-[var(--size-control-sm)] w-[var(--size-control-sm)] p-0",
  icon: "h-[var(--size-control)] w-[var(--size-control)] p-0",
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
};

type ButtonProps = SharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = SharedProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    loading,
    iconLeft,
    iconRight,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const { t } = useLocale();
  const iconSize = size === "sm" || size === "icon-sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.95rem] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)] disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {iconLeft ? <Icon name={iconLeft} className={iconSize} aria-hidden /> : null}
      {loading ? t("common.loading") : children}
      {iconRight ? <Icon name={iconRight} className={iconSize} aria-hidden /> : null}
    </button>
  );
});

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  iconLeft,
  iconRight,
  onClick,
}: LinkButtonProps) {
  const iconSize = size === "sm" || size === "icon-sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[0.95rem] font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {iconLeft ? <Icon name={iconLeft} className={iconSize} aria-hidden /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} className={iconSize} aria-hidden /> : null}
    </Link>
  );
}
