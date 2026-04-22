import type { Identifier, WithTimestamps } from "@/types/common";

export type Clinic = WithTimestamps & {
  id: Identifier;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  accessibilityFeatures: string[];
  services: string[];
};
