export const userRoles = ["guest", "patient", "doctor", "staff", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  clinicId?: string | null;
  phone?: string | null;
};

export type SessionContext = {
  isAuthenticated: boolean;
  isDemo: boolean;
  role: UserRole;
  user: AuthUser | null;
};

export type SignInFields = {
  email: string;
  password: string;
};

export type SignUpFields = SignInFields & {
  fullName: string;
  confirmPassword: string;
  // The form no longer exposes role/phone/terms for public signup; keep optional for compatibility
  role?: Exclude<UserRole, "guest">;
  phone?: string;
  agreedToTerms?: string;
};

export type ForgotPasswordFields = {
  email: string;
};

export type ResetPasswordFields = {
  password: string;
  confirmPassword: string;
};
