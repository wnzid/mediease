import type { UserRole } from "@/types/auth";
import type { Identifier, WithTimestamps } from "@/types/common";

export type Profile = WithTimestamps & {
  id: Identifier;
  fullName: string;
  email: string;
  phone: string;
  role: Exclude<UserRole, "guest">;
  location: string;
  pronouns?: string | null;
  avatarUrl?: string | null;
};

export type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

export type AccessibilityPreferences = WithTimestamps & {
  id: Identifier;
  profileId: Identifier;
  textSize: "default" | "large" | "extra-large";
  reducedMotion: boolean;
  highContrast: boolean;
  simplifiedInterface: boolean;
  preferredLanguage: string;
};

export type NotificationPreferences = {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminders: boolean;
};

export type PatientProfile = WithTimestamps & {
  id: Identifier;
  profileId: Identifier;
  dateOfBirth: string;
  insuranceProvider: string;
  insuranceMemberId: string;
  emergencyContact: EmergencyContact;
  conditions: string[];
  medications: string[];
  allergies: string[];
};
