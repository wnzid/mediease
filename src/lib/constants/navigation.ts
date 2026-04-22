import type { UserRole } from "@/types/auth";
import type { NavigationItem } from "@/types/common";

export const marketingNavigation: NavigationItem[] = [
  { title: "Home", href: "/", icon: "home", labelKey: "nav.home" },
  { title: "Doctors", href: "/doctors", icon: "stethoscope", labelKey: "nav.doctors" },
  { title: "Services", href: "/services", icon: "building-2", labelKey: "nav.services" },
  { title: "Appointments", href: "/appointments", icon: "calendar-days", labelKey: "nav.appointments" },
  { title: "About", href: "/about", icon: "info", labelKey: "nav.about" },
  { title: "Contact", href: "/contact", icon: "phone", labelKey: "nav.contact" },
];

export const roleHomePaths: Record<Exclude<UserRole, "guest">, string> = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  staff: "/staff/dashboard",
  admin: "/admin/dashboard",
};

export const roleLabels: Record<Exclude<UserRole, "guest">, string> = {
  patient: "Patient",
  doctor: "Doctor",
  staff: "Clinic Staff",
  admin: "Admin",
};

export const appNavigation: Record<Exclude<UserRole, "guest">, NavigationItem[]> = {
  patient: [
    { title: "Dashboard", href: "/patient/dashboard", icon: "layout-grid", match: "exact", labelKey: "nav.dashboard" },
    { title: "Appointments", href: "/patient/appointments", icon: "calendar-days", match: "startsWith", labelKey: "nav.appointments" },
    { title: "Find Doctors", href: "/patient/doctors", icon: "stethoscope", match: "startsWith", labelKey: "nav.doctors" },
    { title: "Saved Doctors", href: "/patient/favorites", icon: "heart", match: "exact", labelKey: "nav.savedDoctors" },
    { title: "Messages", href: "/patient/messages", icon: "message-square", match: "exact", labelKey: "nav.messages" },
    { title: "Documents", href: "/patient/documents", icon: "file-text", match: "exact", labelKey: "nav.documents" },
    { title: "Profile", href: "/patient/profile", icon: "user-round", match: "exact", labelKey: "common.profile" },
    { title: "Settings", href: "/patient/settings", icon: "settings-2", match: "exact", labelKey: "common.settings" },
  ],
  doctor: [
    { title: "Dashboard", href: "/doctor/dashboard", icon: "layout-grid", match: "exact", labelKey: "nav.dashboard" },
    { title: "Appointments", href: "/doctor/appointments", icon: "calendar-fold", match: "exact", labelKey: "nav.appointments" },
    { title: "Availability", href: "/doctor/availability", icon: "clock-3", match: "exact", labelKey: "nav.availability" },
    { title: "Patients", href: "/doctor/patients", icon: "users-round", match: "exact", labelKey: "nav.patients" },
    { title: "Profile", href: "/doctor/profile", icon: "badge-plus", match: "exact", labelKey: "common.profile" },
    { title: "Settings", href: "/doctor/settings", icon: "settings-2", match: "exact", labelKey: "common.settings" },
  ],
  staff: [
    { title: "Dashboard", href: "/staff/dashboard", icon: "layout-grid", match: "exact", labelKey: "nav.dashboard" },
    { title: "Appointments", href: "/staff/appointments", icon: "calendar-range", match: "exact", labelKey: "nav.appointments" },
    { title: "Schedules", href: "/staff/schedules", icon: "clipboard-list", match: "exact", labelKey: "nav.schedules" },
    { title: "Patients", href: "/staff/patients", icon: "users-round", match: "exact", labelKey: "nav.patients" },
    { title: "Settings", href: "/staff/settings", icon: "settings-2", match: "exact", labelKey: "common.settings" },
  ],
  admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: "layout-grid", match: "exact", labelKey: "nav.dashboard" },
    { title: "Users", href: "/admin/users", icon: "users-round", match: "exact", labelKey: "nav.users" },
    { title: "Doctors", href: "/admin/doctors", icon: "shield-check", match: "exact", labelKey: "nav.doctors" },
    { title: "Clinics", href: "/admin/clinics", icon: "building-2", match: "exact", labelKey: "nav.clinics" },
    { title: "Appointments", href: "/admin/appointments", icon: "calendar-days", match: "exact", labelKey: "nav.appointments" },
    { title: "Analytics", href: "/admin/analytics", icon: "bar-chart-3", match: "exact", labelKey: "nav.analytics" },
    { title: "Settings", href: "/admin/settings", icon: "settings-2", match: "exact", labelKey: "common.settings" },
  ],
};
