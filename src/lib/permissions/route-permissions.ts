import type { UserRole } from "@/types/auth";
import { roleHomePaths } from "@/lib/constants/navigation";

export const authRoutes = [
  "/sign-in",
  "/staff-login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

export const publicRoutes = [
  "/",
  "/about",
  "/features",
  "/pricing",
  "/accessibility",
  "/faq",
  "/contact",
  "/for-patients",
  "/for-doctors",
  "/trust",
  "/privacy",
];

export function resolveRoleFromPath(pathname: string): Exclude<UserRole, "guest"> | null {
  if (pathname.startsWith("/patient")) return "patient";
  if (pathname.startsWith("/doctor")) return "doctor";
  if (pathname.startsWith("/staff")) return "staff";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

export function getRoleRedirect(role: Exclude<UserRole, "guest">) {
  return roleHomePaths[role];
}
