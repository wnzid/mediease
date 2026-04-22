import type { AppointmentType } from "@/types/appointments";
import type { AppointmentMode } from "@/types/doctors";
import type { ForgotPasswordFields, ResetPasswordFields, SignInFields, SignUpFields } from "@/types/auth";

function emailPattern(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function phonePattern(value: string) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function validateSignIn(fields: SignInFields) {
  const fieldErrors: Partial<Record<keyof SignInFields, string>> = {};

  if (!fields.email || !emailPattern(fields.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!fields.password || fields.password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  return fieldErrors;
}

export function validateSignUp(fields: SignUpFields) {
  const fieldErrors: Partial<Record<keyof SignUpFields, string>> = {};

  if (!fields.fullName.trim()) {
    fieldErrors.fullName = "Enter your full name.";
  }
  if (!emailPattern(fields.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (fields.password.length < 10) {
    fieldErrors.password = "Use at least 10 characters for better security.";
  }

  if (!fields.confirmPassword || fields.password !== fields.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return fieldErrors;
}

export function validateForgotPassword(fields: ForgotPasswordFields) {
  const fieldErrors: Partial<Record<keyof ForgotPasswordFields, string>> = {};

  if (!emailPattern(fields.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  return fieldErrors;
}

export function validateResetPassword(fields: ResetPasswordFields) {
  const fieldErrors: Partial<Record<keyof ResetPasswordFields, string>> = {};

  if (fields.password.length < 10) {
    fieldErrors.password = "Use at least 10 characters for better security.";
  }

  if (fields.password !== fields.confirmPassword) {
    fieldErrors.confirmPassword = "Passwords do not match.";
  }

  return fieldErrors;
}

export type BookingFields = {
  doctorId: string;
  appointmentType: AppointmentType | "";
  mode: AppointmentMode | "";
  date: string;
  time: string;
  reason: string;
  guestFullName?: string;
  guestEmail?: string;
  guestPhone?: string;
};

export function validateBooking(fields: BookingFields) {
  const fieldErrors: Partial<Record<keyof BookingFields, string>> = {};

  if (!fields.doctorId) {
    fieldErrors.doctorId = "Choose a doctor to continue.";
  }

  if (!fields.appointmentType) {
    fieldErrors.appointmentType = "Choose an appointment type.";
  }

  if (!fields.mode) {
    fieldErrors.mode = "Select how you would like to meet.";
  }

  if (!fields.date) {
    fieldErrors.date = "Choose a date.";
  }

  if (!fields.time) {
    fieldErrors.time = "Choose an available time slot.";
  }

  if (!fields.reason.trim()) {
    fieldErrors.reason = "Share a short reason for the visit.";
  }

  // Guest contact info (required for guest bookings)
  if (!fields.guestFullName || !String(fields.guestFullName).trim()) {
    fieldErrors.guestFullName = "Enter your full name.";
  }

  if (!fields.guestEmail || !emailPattern(String(fields.guestEmail))) {
    fieldErrors.guestEmail = "Enter a valid email address.";
  }

  if (fields.guestPhone && !phonePattern(String(fields.guestPhone))) {
    fieldErrors.guestPhone = "Enter a valid phone number.";
  }

  return fieldErrors;
}

// Return validation errors relevant to a single step in the booking flow.
export function getStepErrors(step: number, fields: BookingFields) {
  const stepErrors: Partial<Record<keyof BookingFields, string>> = {};

  switch (step) {
    case 1: // Choose doctor
      if (!fields.doctorId) stepErrors.doctorId = "Choose a doctor to continue.";
      break;
    case 2: // Visit type
      if (!fields.appointmentType) stepErrors.appointmentType = "Choose an appointment type.";
      if (!fields.mode) stepErrors.mode = "Select how you would like to meet.";
      break;
    case 3: // Date and time
      if (!fields.date) stepErrors.date = "Choose a date.";
      if (!fields.time) stepErrors.time = "Choose an available time slot.";
      break;
    case 4: // Reason
      if (!String(fields.reason || "").trim()) stepErrors.reason = "Share a short reason for the visit.";
      break;
    case 5: // Confirm / final validation
      return validateBooking(fields);
    default:
      break;
  }

  return stepErrors;
}

export function isStepValid(step: number, fields: BookingFields) {
  const errors = getStepErrors(step, fields);
  return Object.keys(errors).length === 0;
}
