import type { AppointmentMode } from "@/types/doctors";
import type { Identifier, WithTimestamps } from "@/types/common";

export const appointmentStatuses = [
  "pending",
  "confirmed",
  "completed",
  "canceled",
  "rescheduled",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export type AppointmentType = "new-patient" | "follow-up" | "urgent" | "wellness";

export type Appointment = WithTimestamps & {
  id: Identifier;
  patientId: Identifier;
  doctorId: Identifier;
  clinicId: Identifier;
  reference?: string | null;
  status: AppointmentStatus;
  appointmentType: AppointmentType;
  mode: AppointmentMode;
  reason?: string | null;
  notes?: string | null;
  availabilityId?: Identifier | null; // references doctor_availability.id
  bookedByProfileId?: Identifier | null; // profiles.id who made the booking
  startsAt: string;
  endsAt: string;
  cancelledAt?: string | null;
  cancelledBy?: Identifier | null; // profiles.id who cancelled
  cancellationReason?: string | null;
};

export type AppointmentStatusHistory = WithTimestamps & {
  id: Identifier;
  appointmentId: Identifier;
  status: AppointmentStatus;
  changedBy: Identifier;
  note?: string | null;
};

export type Notification = WithTimestamps & {
  id: Identifier;
  profileId: Identifier;
  title: string;
  body: string;
  read: boolean;
  href?: string;
  category: "appointment" | "system" | "billing" | "care";
};

export type FavoriteDoctor = WithTimestamps & {
  id: Identifier;
  patientId: Identifier;
  doctorId: Identifier;
};
