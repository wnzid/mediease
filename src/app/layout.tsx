import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { siteConfig } from "@/lib/constants/site";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import en from "@/lib/i18n/dictionaries/en";
import lt from "@/lib/i18n/dictionaries/lt";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Accessible healthcare appointments`,
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
  },
};


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const DICT: Record<string, any> = { en, lt };
  const skipText = (DICT[initialLocale]?.common?.skipToContent as string) ?? "Skip to main content";

  return (
    <html lang={initialLocale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink-900)] antialiased">
        <AppProviders initialLocale={initialLocale}>
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-full bg-[var(--color-brand-700)] px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {skipText}
          </a>
          {children}
          <SpeedInsights />
        </AppProviders>
      </body>
    </html>
  );
}
