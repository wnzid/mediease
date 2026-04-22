import type { Appointment, AppointmentStatusHistory, FavoriteDoctor, Notification } from "@/types/appointments";
import type { Clinic } from "@/types/clinics";
import type { AvailabilitySlot, Doctor, DoctorClinic } from "@/types/doctors";
import type { AccessibilityPreferences, PatientProfile, Profile } from "@/types/profiles";

export type DatabaseTables = {
  profiles: Profile;
  patient_profiles: PatientProfile;
  doctors: Doctor;
  clinics: Clinic;
  doctor_clinics: DoctorClinic;
  appointments: Appointment;
  appointment_status_history: AppointmentStatusHistory;
  doctor_availability: AvailabilitySlot;
  notifications: Notification;
  favorites: FavoriteDoctor;
  accessibility_preferences: AccessibilityPreferences;
};
