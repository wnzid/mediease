import type { Metadata } from "next";

export const siteConfig = {
  name: "MediEase",
  description:
    "MediEase is a calm, accessible healthcare appointment platform for patients, doctors, clinics, and care teams.",
  url: "https://mediease.vercel.app",
  supportEmail: "support@mediease.example.com",
  phone: "+370 11223333",
  address: "Siauliai, Lithuania",
  openingHours: "Mon–Fri 08:00–17:00; Sat 09:00–13:00; Sun closed",
  emergencyPhone: "112",
};

export function buildMetadata({
  title,
  description,
}: {
  title: string;
  description?: string;
}): Metadata {
  const resolvedTitle = `${title} | ${siteConfig.name}`;
  const resolvedDescription = description ?? siteConfig.description;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      siteName: siteConfig.name,
      type: "website",
      url: siteConfig.url,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}
