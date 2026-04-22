export type Identifier = string;

export type WithTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

export type NavigationItem = {
  title: string;
  href: string;
  icon: string;
  match?: "exact" | "startsWith";
  badge?: string;
  labelKey?: string;
};

export type StatValue = string | number;

export type KeyMetric = {
  label: string;
  value: StatValue;
  delta?: string;
  tone?: "neutral" | "positive" | "warning";
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type AsyncActionState<TFields extends Record<string, unknown> = Record<string, unknown>> = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof TFields & string, string>>;
  redirectTo?: string;
};
