import type { Identifier, WithTimestamps } from "@/types/common";

export type AppointmentMode = "in-person" | "telehealth";

export type Doctor = WithTimestamps & {
  id: Identifier;
  profileId: Identifier;
  slug: string;
  fullName: string;
  specialty: string;
  subSpecialty?: string;
  yearsExperience: number;
  languages: string[];
  clinicIds: Identifier[];
  rating: number;
  reviewCount: number;
  acceptsTelehealth: boolean;
  acceptsNewPatients: boolean;
  insuranceAccepted: string[];
  bio: string;
  careApproach: string;
  education: string[];
  avatarUrl?: string | null;
};

export type DoctorClinic = WithTimestamps & {
  id: Identifier;
  doctorId: Identifier;
  clinicId: Identifier;
  title: string;
  primaryClinic: boolean;
};

export type AvailabilitySlot = WithTimestamps & {
  id: Identifier;
  doctorId: Identifier;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  appointmentMode: AppointmentMode;
  isBreak: boolean;
};

export type DoctorAvailability = WithTimestamps & {
  id: Identifier;
  doctorId: Identifier; // doctor_profiles.id (also profiles.id)
  availabilityDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM:SS or ISO time
  endTime: string; // HH:MM:SS or ISO time
  slotDurationMinutes: number;
  appointmentMode: AppointmentMode;
  isActive: boolean;
  notes?: string | null;
};
