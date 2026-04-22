"use client";

import { LanguageSwitcher as InnerLanguageSwitcher } from "./LanguageSwitcher";

export default function LanguageSwitcher(props: { compact?: boolean }) {
  return <InnerLanguageSwitcher {...props} />;
}
